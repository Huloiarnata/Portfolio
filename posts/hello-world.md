---
title: Hello World — Building This Site
date: 2026-08-17
tags: [meta, web]
---

# Hello World

This is the first post on my portfolio. I built this site to have a single place for my work, research, and writing — inspired by the design language of [Oxide Computer Company](https://oxide.computer).

## Why a Static Site?

I wanted something fast, minimal, and easy to maintain. No databases, no CMS — just HTML, CSS, and a bit of JavaScript. The blog posts are written in Markdown, and the site fetches them at runtime.

## The Stack

<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: browser fetches static HTML/CSS/JS from GitHub Pages, then hydrates from JSON and Markdown">
  <defs>
    <marker id="arr-hw" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
    </marker>
  </defs>

  <text x="340" y="24" fill="#9ba2a8" font-size="11" text-anchor="middle">How a page loads</text>

  <!-- GitHub Pages -->
  <rect x="30" y="60" width="140" height="70" rx="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <text x="100" y="85" fill="currentColor" font-size="11" text-anchor="middle" font-weight="600">GitHub Pages</text>
  <text x="100" y="102" fill="currentColor" font-size="9" opacity="0.55" text-anchor="middle">HTML · CSS · JS</text>
  <text x="100" y="116" fill="currentColor" font-size="9" opacity="0.55" text-anchor="middle">data/*.json · posts/*.md</text>

  <!-- Browser -->
  <rect x="260" y="45" width="180" height="100" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="350" y="70" fill="currentColor" font-size="11" text-anchor="middle" font-weight="600">Browser</text>
  <rect x="275" y="82" width="70" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="310" y="98" fill="currentColor" font-size="9" text-anchor="middle">main.js</text>
  <rect x="355" y="82" width="70" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="390" y="98" fill="currentColor" font-size="9" text-anchor="middle">parseMd()</text>
  <rect x="275" y="112" width="150" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="350" y="128" fill="currentColor" font-size="9" text-anchor="middle">DOM Render</text>

  <!-- GitHub API -->
  <rect x="530" y="60" width="120" height="70" rx="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <text x="590" y="85" fill="currentColor" font-size="11" text-anchor="middle" font-weight="600">GitHub API</text>
  <text x="590" y="102" fill="currentColor" font-size="9" opacity="0.55" text-anchor="middle">/users/repos</text>
  <text x="590" y="116" fill="currentColor" font-size="9" opacity="0.55" text-anchor="middle">(project cards)</text>

  <!-- localStorage -->
  <rect x="290" y="180" width="120" height="46" rx="4" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="350" y="204" fill="currentColor" font-size="10" text-anchor="middle" font-weight="600">localStorage</text>
  <text x="350" y="218" fill="currentColor" font-size="8.5" opacity="0.5" text-anchor="middle">theme preference</text>

  <!-- Arrows -->
  <line x1="170" y1="95" x2="255" y2="95" stroke="currentColor" stroke-width="1" marker-end="url(#arr-hw)"/>
  <text x="212" y="88" fill="currentColor" font-size="8" text-anchor="middle" opacity="0.55">initial load</text>
  <line x1="440" y1="95" x2="525" y2="95" stroke="currentColor" stroke-width="1" marker-end="url(#arr-hw)"/>
  <text x="482" y="88" fill="currentColor" font-size="8" text-anchor="middle" opacity="0.55">fetch repos</text>
  <line x1="350" y1="150" x2="350" y2="175" stroke="currentColor" stroke-width="1" marker-end="url(#arr-hw)"/>
  <text x="385" y="168" fill="currentColor" font-size="8" opacity="0.55">read/write</text>
</svg>

- **Pure HTML/CSS/JS** — no frameworks, no build step
- **GitHub Pages** — free hosting; `.nojekyll` bypasses Jekyll processing
- **Config-driven** — content lives in `data/*.json` and `posts/*.md`
- **Runtime hydration** — the browser fetches JSON and merges GitHub repo data client-side

## The Design

Colors are stored as CSS custom properties. Dark and light themes swap the token values; every component reads from tokens, so nothing hard-codes a color. This is the token strip:

<svg viewBox="0 0 680 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Design tokens: accent, text, borders">
  <rect x="20" y="15" width="100" height="30" fill="#48d597"/>
  <text x="70" y="35" fill="#08110a" font-size="10" text-anchor="middle" font-weight="600">--accent</text>
  <rect x="130" y="15" width="100" height="30" fill="#e7e8e9"/>
  <text x="180" y="35" fill="#1a1d21" font-size="10" text-anchor="middle" font-weight="600">--text-primary</text>
  <rect x="240" y="15" width="100" height="30" fill="#9ba2a8"/>
  <text x="290" y="35" fill="#08110a" font-size="10" text-anchor="middle" font-weight="600">--text-secondary</text>
  <rect x="350" y="15" width="100" height="30" fill="#1e2e33"/>
  <text x="400" y="35" fill="#e7e8e9" font-size="10" text-anchor="middle" font-weight="600">--border</text>
  <rect x="460" y="15" width="100" height="30" fill="#080f11"/>
  <text x="510" y="35" fill="#e7e8e9" font-size="10" text-anchor="middle" font-weight="600">--bg-primary</text>
</svg>

## What's Next

I'll be writing about systems engineering, kernel internals, distributed storage, and the things I learn while working on PowerScale at Dell Technologies. Stay tuned.
