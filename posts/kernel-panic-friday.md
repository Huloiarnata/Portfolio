---
title: "The Friday I Learned to Read a Kernel Panic"
date: 2026-07-30
tags: [kernel, debugging, freebsd]
---

Kernel panics have a reputation for being cryptic. My honest experience is that they're the *most* legible bug reports I've ever encountered — once you know what to look at.

## The panic

At 4:47 PM on a Friday, a node in our test cluster dropped. I found this waiting for me:

```
Fatal trap 12: page fault while in kernel mode
cpuid = 3; apic id = 03
fault virtual address   = 0x0
fault code              = supervisor read data, page not present
instruction pointer     = 0x20:0xffffffff80a8f2b1
stack pointer           = 0x28:0xfffffe0107aa5a20
frame pointer           = 0x28:0xfffffe0107aa5a40
```

Three things jumped out:

1. **Fault at address 0.** That's a NULL dereference. Every kernel panic that starts with `0x0` is basically the machine handing you a stack trace and saying "someone forgot to check."
2. **Instruction pointer in kernel space** (`0xffffffff80...`). The panic is inside the kernel, not a user process.
3. **Supervisor read.** The CPU was reading, not writing. So we're chasing a pointer that was NULL when it should have held a valid address.

## The stack trace

```
#0  panic()      at panic+0x1e3
#1  trap_fatal() at trap_fatal+0x407
#2  trap()       at trap+0x2a1
#3  calltrap()   at calltrap+0x8
#4  vm_page_wire_mapped() at vm_page_wire_mapped+0x21
#5  vm_object_page_clean() at vm_object_page_clean+0x156
#6  vinvalbuf() at vinvalbuf+0x74
```

Reading bottom-up: something called `vinvalbuf()` → which called `vm_object_page_clean()` → which called `vm_page_wire_mapped()` → which dereferenced NULL and died.

The clue is in frame #4. `vm_page_wire_mapped` takes a `vm_page_t` argument. If it's NULL, we die exactly like this.

## The hunt

I opened `sys/vm/vm_page.c` and read `vm_page_wire_mapped`. The first line of the function dereferences the page pointer to increment a wire count. No NULL check — because there's not supposed to be one; the caller is supposed to already hold the page busy.

So the caller — `vm_object_page_clean` — was passing NULL. Why?

`vm_object_page_clean` walks a VM object's resident pages via a radix tree lookup. The tree lookup returns NULL when the page has been freed *between* the caller acquiring the object lock and the tree lookup happening. That's the race.

## The race, in a picture

Here's the interleaving that produced the NULL:

<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timeline of the race: unmap thread frees the page while fsync thread walks the radix tree">
  <text x="340" y="20" fill="#9ba2a8" font-size="11" text-anchor="middle">Race — fsync thread vs. concurrent unmap</text>

  <!-- fsync lane -->
  <line x1="60" y1="70" x2="640" y2="70" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
  <text x="50" y="74" fill="currentColor" font-size="10" text-anchor="end" font-weight="600">fsync</text>

  <!-- unmap lane -->
  <line x1="60" y1="150" x2="640" y2="150" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>
  <text x="50" y="154" fill="currentColor" font-size="10" text-anchor="end" font-weight="600">unmap</text>

  <!-- fsync events -->
  <circle cx="120" cy="70" r="4" fill="#48d597"/>
  <text x="120" y="55" fill="currentColor" font-size="9" text-anchor="middle">lock obj</text>

  <circle cx="240" cy="70" r="4" fill="#48d597"/>
  <text x="240" y="55" fill="currentColor" font-size="9" text-anchor="middle">radix lookup</text>
  <text x="240" y="90" fill="#48d597" font-size="9" text-anchor="middle">→ page*</text>

  <circle cx="480" cy="70" r="6" fill="#f87171" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="480" y="55" fill="#f87171" font-size="9" text-anchor="middle" font-weight="600">deref → PANIC</text>

  <!-- unmap events -->
  <circle cx="340" cy="150" r="4" fill="#fbbf24"/>
  <text x="340" y="170" fill="currentColor" font-size="9" text-anchor="middle">page freed</text>

  <circle cx="410" cy="150" r="4" fill="#fbbf24"/>
  <text x="410" y="170" fill="currentColor" font-size="9" text-anchor="middle">slot cleared</text>

  <!-- Gap arrow -->
  <line x1="240" y1="70" x2="480" y2="70" stroke="#f87171" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="360" y="60" fill="#f87171" font-size="9" text-anchor="middle" opacity="0.8">page reused elsewhere in this window</text>
</svg>

Between the radix lookup and the dereference, another thread freed the page and the memory was reused. The fsync thread was holding a pointer that no longer meant what it thought it meant.

## The fix

The fix ended up being a two-line change in the caller: check for NULL after the radix lookup, and skip if the page was freed underneath us. The bug had been there since a refactor eight months earlier — nobody had hit it because it required a specific pattern of concurrent unmap + fsync that only our test rig produced.

## What I learned

- **A NULL panic in the kernel is not scary.** It's the friendliest kind of bug: the machine tells you exactly where to look.
- **Read the fault code.** "Supervisor read" narrows the search to loads, not stores. "Kernel mode" narrows it to your code, not userspace.
- **The stack trace is not the bug — it's the map.** The bug is usually one frame up from where the panic happens.

I've since written a small `dtrace` probe that logs the caller of `vm_page_wire_mapped` whenever it's about to be passed NULL, so we get a warning instead of a panic if this race ever wakes up again.
