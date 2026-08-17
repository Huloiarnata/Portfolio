---
title: "Performance in Distributed Systems — Where Latency Hides"
date: 2026-08-18
tags: [systems, performance, distributed]
---

Performance in distributed systems is deceptive. A single node might handle a request in 2ms, but the same operation across a cluster can spike to 200ms — or worse, timeout entirely. Understanding where latency hides is the difference between a system that scales and one that crumbles.

## The Anatomy of a Distributed Request

When a client sends a request to a distributed storage cluster, the journey is rarely straightforward. The request hits a protocol layer (NFS, SMB, S3), gets routed to the correct node, potentially fans out to multiple data nodes, waits for quorum, and returns. Each hop introduces latency, and each layer introduces variance.

<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" style="font-family: 'JetBrains Mono', monospace;">
  <rect width="680" height="200" fill="none"/>
  <line x1="40" y1="100" x2="640" y2="100" stroke="#1e2e33" stroke-width="1"/>
  <rect x="40" y="70" width="90" height="60" rx="4" fill="rgba(72,213,151,0.08)" stroke="#2a7d59" stroke-width="1"/>
  <text x="85" y="95" fill="#48d597" font-size="10" text-anchor="middle">CLIENT</text>
  <text x="85" y="110" fill="#5e6b73" font-size="8" text-anchor="middle">0ms</text>
  <line x1="130" y1="100" x2="170" y2="100" stroke="#48d597" stroke-width="1.5" marker-end="url(#arrow)"/>
  <rect x="170" y="70" width="90" height="60" rx="4" fill="rgba(72,213,151,0.08)" stroke="#2a7d59" stroke-width="1"/>
  <text x="215" y="95" fill="#48d597" font-size="10" text-anchor="middle">PROTOCOL</text>
  <text x="215" y="110" fill="#5e6b73" font-size="8" text-anchor="middle">+0.3ms</text>
  <line x1="260" y1="100" x2="300" y2="100" stroke="#48d597" stroke-width="1.5"/>
  <rect x="300" y="70" width="90" height="60" rx="4" fill="rgba(72,213,151,0.08)" stroke="#2a7d59" stroke-width="1"/>
  <text x="345" y="95" fill="#48d597" font-size="10" text-anchor="middle">ROUTING</text>
  <text x="345" y="110" fill="#5e6b73" font-size="8" text-anchor="middle">+1.2ms</text>
  <line x1="390" y1="100" x2="430" y2="100" stroke="#48d597" stroke-width="1.5"/>
  <rect x="430" y="70" width="90" height="60" rx="4" fill="rgba(72,213,151,0.15)" stroke="#48d597" stroke-width="1.5"/>
  <text x="475" y="95" fill="#48d597" font-size="10" text-anchor="middle">DATA NODE</text>
  <text x="475" y="110" fill="#5e6b73" font-size="8" text-anchor="middle">+4.8ms</text>
  <line x1="520" y1="100" x2="560" y2="100" stroke="#48d597" stroke-width="1.5"/>
  <rect x="560" y="70" width="80" height="60" rx="4" fill="rgba(72,213,151,0.08)" stroke="#2a7d59" stroke-width="1"/>
  <text x="600" y="95" fill="#48d597" font-size="10" text-anchor="middle">QUORUM</text>
  <text x="600" y="110" fill="#5e6b73" font-size="8" text-anchor="middle">+12ms</text>
  <text x="340" y="170" fill="#5e6b73" font-size="9" text-anchor="middle">total p50: ~18ms — but p99 tells a different story</text>
  <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#48d597"/></marker></defs>
</svg>

The p50 looks fine. The p99 tells the real story. In my experience working on PowerScale, the tail latency — that top 1% — is where the actual engineering challenge lives.

## Tail Latency: The Silent Killer

Jeff Dean's famous observation still holds: at scale, even a 1-in-1000 slow operation becomes common. If your service fans out to 100 nodes, you will hit a p99.9 latency on nearly every request.

<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" style="font-family: 'JetBrains Mono', monospace;">
  <rect width="680" height="320" fill="none"/>
  <text x="340" y="24" fill="#9ba2a8" font-size="11" text-anchor="middle">Latency Distribution — Read Operations (4KB random)</text>
  <line x1="60" y1="40" x2="60" y2="260" stroke="#1e2e33" stroke-width="1"/>
  <line x1="60" y1="260" x2="650" y2="260" stroke="#1e2e33" stroke-width="1"/>
  <text x="20" y="265" fill="#5e6b73" font-size="8" text-anchor="middle" transform="rotate(-90,20,180)">Request Count</text>
  <text x="355" y="290" fill="#5e6b73" font-size="9" text-anchor="middle">Latency (ms)</text>
  <text x="100" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">1</text>
  <text x="180" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">2</text>
  <text x="260" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">5</text>
  <text x="340" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">10</text>
  <text x="420" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">20</text>
  <text x="500" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">50</text>
  <text x="580" y="275" fill="#5e6b73" font-size="8" text-anchor="middle">100</text>
  <path d="M80,250 Q120,245 140,220 Q160,170 180,90 Q200,55 220,60 Q260,80 300,150 Q340,200 380,230 Q420,245 460,250 Q500,252 540,254 Q580,255 620,256" fill="none" stroke="#48d597" stroke-width="2"/>
  <path d="M80,250 Q120,245 140,220 Q160,170 180,90 Q200,55 220,60 Q260,80 300,150 Q340,200 380,230 Q420,245 460,250 Q500,252 540,254 Q580,255 620,256 L620,260 L80,260 Z" fill="rgba(72,213,151,0.06)"/>
  <line x1="196" y1="40" x2="196" y2="260" stroke="#48d597" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="196" y="38" fill="#48d597" font-size="8" text-anchor="middle">p50: 2.1ms</text>
  <line x1="440" y1="40" x2="440" y2="260" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="440" y="38" fill="#fbbf24" font-size="8" text-anchor="middle">p99: 28ms</text>
  <line x1="570" y1="40" x2="570" y2="260" stroke="#f87171" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="570" y="38" fill="#f87171" font-size="8" text-anchor="middle">p99.9: 87ms</text>
  <rect x="80" y="300" width="10" height="3" rx="1" fill="#48d597"/>
  <text x="95" y="305" fill="#5e6b73" font-size="8">p50</text>
  <rect x="130" y="300" width="10" height="3" rx="1" fill="#fbbf24"/>
  <text x="145" y="305" fill="#5e6b73" font-size="8">p99</text>
  <rect x="180" y="300" width="10" height="3" rx="1" fill="#f87171"/>
  <text x="195" y="305" fill="#5e6b73" font-size="8">p99.9</text>
</svg>

The gap between p50 and p99.9 is a **42x multiplier**. This is normal for distributed systems. The question is: what's causing it?

## Common Latency Sources

### 1. Network Round Trips

The biggest contributor in most distributed systems isn't computation — it's network. A cross-rack RTT might be 0.5ms, but cross-datacenter can be 10-50ms. Every additional round trip compounds.

### 2. Lock Contention

In storage systems, metadata operations often require distributed locks. When multiple nodes contend for the same lock, serialization kicks in and throughput drops. We've measured contention delays as high as 150ms during metadata-heavy workloads on PowerScale.

### 3. Garbage Collection and Memory Pressure

Even in C/C++ systems where you don't have a traditional GC, memory allocator contention and TLB misses add up. In managed-language services, GC pauses are the most common source of p99 spikes.

### 4. Queue Depth and Head-of-Line Blocking

When a slow operation sits at the head of a queue, everything behind it waits. This is particularly brutal in protocol layers where a single slow NFS operation can block faster operations on the same TCP connection.

<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" style="font-family: 'JetBrains Mono', monospace;">
  <rect width="680" height="260" fill="none"/>
  <text x="340" y="24" fill="#9ba2a8" font-size="11" text-anchor="middle">Throughput vs Queue Depth — 4KB Random Reads</text>
  <line x1="80" y1="40" x2="80" y2="210" stroke="#1e2e33" stroke-width="1"/>
  <line x1="80" y1="210" x2="620" y2="210" stroke="#1e2e33" stroke-width="1"/>
  <text x="30" y="130" fill="#5e6b73" font-size="8" text-anchor="middle" transform="rotate(-90,30,130)">IOPS (thousands)</text>
  <text x="350" y="240" fill="#5e6b73" font-size="9" text-anchor="middle">Queue Depth</text>
  <text x="130" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">1</text>
  <text x="210" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">4</text>
  <text x="290" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">16</text>
  <text x="370" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">32</text>
  <text x="450" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">64</text>
  <text x="530" y="225" fill="#5e6b73" font-size="8" text-anchor="middle">128</text>
  <text x="70" y="203" fill="#5e6b73" font-size="7" text-anchor="end">0</text>
  <text x="70" y="168" fill="#5e6b73" font-size="7" text-anchor="end">50</text>
  <text x="70" y="133" fill="#5e6b73" font-size="7" text-anchor="end">100</text>
  <text x="70" y="98" fill="#5e6b73" font-size="7" text-anchor="end">150</text>
  <text x="70" y="63" fill="#5e6b73" font-size="7" text-anchor="end">200</text>
  <line x1="80" y1="200" x2="620" y2="200" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="165" x2="620" y2="165" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="130" x2="620" y2="130" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="95" x2="620" y2="95" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="60" x2="620" y2="60" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <path d="M130,195 L210,155 L290,95 L370,72 L450,68 L530,75" fill="none" stroke="#48d597" stroke-width="2"/>
  <circle cx="130" cy="195" r="3" fill="#48d597"/>
  <circle cx="210" cy="155" r="3" fill="#48d597"/>
  <circle cx="290" cy="95" r="3" fill="#48d597"/>
  <circle cx="370" cy="72" r="3" fill="#48d597"/>
  <circle cx="450" cy="68" r="3" fill="#48d597"/>
  <circle cx="530" cy="75" r="3" fill="#48d597"/>
  <path d="M130,198 L210,185 L290,160 L370,150 L450,170 L530,190" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,3"/>
  <circle cx="130" cy="198" r="3" fill="#fbbf24"/>
  <circle cx="210" cy="185" r="3" fill="#fbbf24"/>
  <circle cx="290" cy="160" r="3" fill="#fbbf24"/>
  <circle cx="370" cy="150" r="3" fill="#fbbf24"/>
  <circle cx="450" cy="170" r="3" fill="#fbbf24"/>
  <circle cx="530" cy="190" r="3" fill="#fbbf24"/>
  <rect x="400" y="45" width="8" height="3" rx="1" fill="#48d597"/>
  <text x="412" y="49" fill="#5e6b73" font-size="8">with QoS isolation</text>
  <rect x="400" y="57" width="8" height="3" rx="1" fill="#fbbf24"/>
  <text x="412" y="61" fill="#5e6b73" font-size="8">without QoS</text>
</svg>

Notice how throughput plateaus and then drops without QoS isolation? That's head-of-line blocking in action. At queue depth 128, mixed workloads starve each other and the system regresses to lower throughput than queue depth 16.

## Measuring What Matters

The tools matter as much as the metrics. In kernel-level work, DTrace and eBPF give you per-operation visibility without meaningful overhead. In userspace services, distributed tracing (with proper span propagation) is non-negotiable.

Key metrics to track:

- **p50, p99, p99.9 latency** — not averages. Averages lie. A service with 1ms average might have 500ms spikes that destroy user experience.
- **Throughput at saturation** — how the system behaves when pushed to the wall matters more than idle benchmarks.
- **Queue wait time vs service time** — separating how long a request waits from how long it actually takes to process reveals contention issues.
- **Lock hold duration** — in storage systems, this is often the root cause of tail latency.

## The Cache Layer

Caching is the universal performance lever, but it's also where subtle bugs hide. In my work on PowerScale's cache partitioning scheme, we found that a naive LRU eviction policy caused cache thrashing under mixed workloads — sequential reads would evict hot random-read data, tanking the hit ratio.

<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="font-family: 'JetBrains Mono', monospace;">
  <rect width="680" height="280" fill="none"/>
  <text x="340" y="24" fill="#9ba2a8" font-size="11" text-anchor="middle">Cache Hit Ratio Over Time — Before &amp; After Partitioning</text>
  <line x1="80" y1="40" x2="80" y2="230" stroke="#1e2e33" stroke-width="1"/>
  <line x1="80" y1="230" x2="620" y2="230" stroke="#1e2e33" stroke-width="1"/>
  <text x="30" y="140" fill="#5e6b73" font-size="8" text-anchor="middle" transform="rotate(-90,30,140)">Hit Ratio (%)</text>
  <text x="350" y="255" fill="#5e6b73" font-size="9" text-anchor="middle">Time (hours)</text>
  <text x="70" y="228" fill="#5e6b73" font-size="7" text-anchor="end">0</text>
  <text x="70" y="185" fill="#5e6b73" font-size="7" text-anchor="end">25</text>
  <text x="70" y="140" fill="#5e6b73" font-size="7" text-anchor="end">50</text>
  <text x="70" y="95" fill="#5e6b73" font-size="7" text-anchor="end">75</text>
  <text x="70" y="52" fill="#5e6b73" font-size="7" text-anchor="end">100</text>
  <line x1="80" y1="185" x2="620" y2="185" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="140" x2="620" y2="140" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <line x1="80" y1="95" x2="620" y2="95" stroke="#1e2e33" stroke-width="0.5" stroke-dasharray="2,4"/>
  <path d="M100,155 L140,145 L180,160 L220,190 L260,210 L300,195 L340,205 L380,215 L420,200 L460,210 L500,195 L540,205 L580,200" fill="none" stroke="#f87171" stroke-width="1.5" stroke-dasharray="6,3"/>
  <path d="M100,155 L140,130 L180,105 L220,85 L260,75 L300,68 L340,65 L380,62 L420,60 L460,58 L500,56 L540,55 L580,54" fill="none" stroke="#48d597" stroke-width="2"/>
  <line x1="300" y1="40" x2="300" y2="230" stroke="#5e6b73" stroke-width="1" stroke-dasharray="3,5"/>
  <text x="303" y="48" fill="#5e6b73" font-size="7">mixed workload starts</text>
  <rect x="420" y="265" width="8" height="3" rx="1" fill="#48d597"/>
  <text x="432" y="269" fill="#5e6b73" font-size="8">partitioned (240% improvement)</text>
  <rect x="420" y="275" width="8" height="3" rx="1" fill="#f87171"/>
  <text x="432" y="279" fill="#5e6b73" font-size="8">naive LRU</text>
</svg>

The partitioned scheme maintained a steady climb to ~97% hit ratio even under mixed workloads, while the naive approach collapsed to ~25% whenever sequential scans kicked in. That 240% improvement in hit ratio translated directly to reduced disk I/O and lower read latency.

## Lessons

1. **Measure tail latency, not averages.** If you're only tracking p50, you're blind to the user experience of 1 in 100 requests.

2. **Isolate workloads.** Mixed workloads competing for shared resources (caches, queues, locks) will destroy each other's performance. QoS frameworks that separate operation classes aren't a luxury — they're a necessity at scale.

3. **Profile in production.** Lab benchmarks with synthetic loads catch maybe 60% of real-world performance issues. The other 40% only show up under real access patterns with real data distributions.

4. **Latency budgets are multiplicative.** If you have 5 serial hops and each has a 1% chance of being slow, you have a 5% chance of a slow request. Fan-out makes this exponentially worse.

The hardest part of distributed systems performance isn't finding the bottleneck — it's finding it *before* it matters.

---

*This is part of an ongoing series on systems engineering at scale. Next up: how we built the Slow-OPs monitoring daemon and what it taught us about proactive debugging.*
