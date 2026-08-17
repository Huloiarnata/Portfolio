---
title: "Why I Still Reach for C in 2026"
date: 2026-07-15
tags: [languages, systems, opinion]
---

> *A guest post by Meera Iyer. If you'd like to publish here too, see the [contributor guide](https://github.com/Huloiarnata/Portfolio/blob/main/posts/README.md).*

Every year around July someone writes the same essay: "C is dead, Rust won, get on with it." Every year around August I write the counter-essay: no, C is fine, and here's when it's actually the right tool.

## The abstraction budget

Every language has an *abstraction budget* — the amount of cognitive space between the code you write and the machine that runs it. Rust, Go, Zig, C++, Python, JavaScript — each spends that budget differently.

- **Python** spends it on developer ergonomics.
- **Rust** spends it on compile-time correctness.
- **Go** spends it on developer velocity and runtime simplicity.
- **C** doesn't spend it at all. The budget is zero.

<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstraction budget spent per language: C at 0, up to Python at high">
  <text x="340" y="20" fill="#9ba2a8" font-size="11" text-anchor="middle">Abstraction budget — roughly, per language</text>

  <!-- axes -->
  <line x1="80" y1="60" x2="80" y2="200" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <line x1="80" y1="200" x2="640" y2="200" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="70" y="205" fill="currentColor" font-size="9" text-anchor="end" opacity="0.5">0</text>
  <text x="70" y="65" fill="currentColor" font-size="9" text-anchor="end" opacity="0.5">high</text>

  <!-- Bars -->
  <rect x="120" y="185" width="60" height="15"  fill="#48d597"/>
  <text x="150" y="215" fill="currentColor" font-size="10" text-anchor="middle">C</text>

  <rect x="200" y="150" width="60" height="50"  fill="#48d597" opacity="0.75"/>
  <text x="230" y="215" fill="currentColor" font-size="10" text-anchor="middle">Zig</text>

  <rect x="280" y="130" width="60" height="70"  fill="#48d597" opacity="0.75"/>
  <text x="310" y="215" fill="currentColor" font-size="10" text-anchor="middle">Rust</text>

  <rect x="360" y="115" width="60" height="85"  fill="#48d597" opacity="0.75"/>
  <text x="390" y="215" fill="currentColor" font-size="10" text-anchor="middle">C++</text>

  <rect x="440" y="95"  width="60" height="105" fill="#48d597" opacity="0.75"/>
  <text x="470" y="215" fill="currentColor" font-size="10" text-anchor="middle">Go</text>

  <rect x="520" y="70"  width="60" height="130" fill="#48d597" opacity="0.75"/>
  <text x="550" y="215" fill="currentColor" font-size="10" text-anchor="middle">Python</text>

  <text x="150" y="180" fill="#48d597" font-size="8" text-anchor="middle">~0</text>
</svg>

When you're writing kernel code, firmware, a signal-processing hot loop, a garbage collector for someone else's language — the abstraction budget is *hostile*. Anything the language does that you didn't ask for is a bug in production, waiting.

## When zero-abstraction is the right tool

**Firmware for a device with 32 KB of RAM.** You cannot afford a runtime. C's runtime is `crt0` — about 200 bytes of setup and a jump to `main`. Everything else is yours.

**A parser called a billion times per day.** You want to know exactly what's on the stack, what's in registers, and whether the compiler can inline your hot loop. C makes this trivial to reason about; higher-level languages hide it behind allocators and virtual dispatch.

**A kernel module.** You're in someone else's memory model, running with someone else's stack, invisible to userspace debuggers. C is the language everyone in that space already speaks.

**Interop.** Every language on earth has an FFI to C. If you're writing a library that needs to be callable from Python, Ruby, Node, Go, and Rust, C is the *lingua franca*.

## When it's the wrong tool

I'm not romantic about it. C is wrong for:

- Anything web-facing. Use a memory-safe language.
- Anything with untrusted input at a network boundary. Use a memory-safe language.
- Anything a junior engineer will maintain unsupervised. Use a memory-safe language.
- Anything you'd rather ship in a week than a month. Almost always, use a higher-level language.

## The honest tradeoff

I use Rust for new projects when the domain fits — network services, tools with concurrency, anything that touches untrusted input. I use Go when I need to ship fast and don't need every cycle. And I reach for C when I know exactly what I want the machine to do and want the language to *get out of the way*.

There is no crown. There are just tools. C is one of them, and in 2026, it's still the right one about 15% of the time in the work I do.

Fight me on Bluesky.
