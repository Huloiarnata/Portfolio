# Contributing

Thanks for your interest in contributing to this repository.

This project is my personal portfolio. Contributions are welcome for:
- **Blog posts** (guest writing — see [`posts/README.md`](posts/README.md))
- **Bug fixes** to the template code (broken layouts, JS bugs, accessibility issues)
- **Design/UX improvements** to the template

Contributions are **not** accepted for:
- Changes to my personal biography, experience, publications, or projects list
- Anything that alters or removes the copyright notice in `LICENSE`
- Trivial cosmetic tweaks (whitespace, emoji, "improvements" without a stated reason)

---

## How to contribute

1. **Fork** the repository.
2. **Create a branch** off `main`, named descriptively:
   ```bash
   git checkout -b feat/blog-post-drone-build
   git checkout -b fix/mobile-nav-overflow
   ```
3. **Make your change**, keeping the diff scoped. Do not bundle unrelated changes.
4. **Verify locally** — open `index.html` (or serve the folder) and check both dark and light theme, mobile and desktop.
5. **Open a Pull Request** against `main`. Fill in the PR description:
   - What changed and why
   - Screenshots if visual
   - Links to any related issue

---

## Review policy

- **Every PR requires my review.** I am the sole maintainer and merger.
- Automated merges, self-approvals, and bypass-review requests will be rejected.
- Blog post PRs are reviewed for tone, factual accuracy, and format compliance
  (see [`posts/README.md`](posts/README.md)) — not for opinion. If your writing
  is coherent and follows the format, it will likely be merged.
- Template/code PRs are reviewed for correctness, no regressions, and design fit.
- I aim to respond within a week. Poke me on the PR if it's been longer.

---

## Commit style

- Present-tense, imperative: `add prev/next nav to post page`, not `added...`
- One logical change per commit where possible
- Reference the PR/issue in the body if useful; the title should stand alone

Example:
```
add drone-build blog series post 2

Second post in the drone series covering frame assembly and
initial motor calibration. Adds inline SVG for the wiring diagram.
```

---

## Licensing implications of contributing

By opening a pull request against this repository, you agree that:

- **Code contributions** are licensed under GPLv3 to match the rest of the repo.
- **Blog post contributions** remain your copyright, but you grant the
  repository the perpetual, non-exclusive right to publish them on this site.
  You are responsible for ensuring you own the rights to any text, code snippets,
  images, or diagrams you include.
- You will not attempt to modify anyone else's content or biographical material.

See [`LICENSE`](LICENSE) for the full split-license details.

---

## Reporting security issues

Do not open a public issue for security problems. Email
`ronit.kumar710.nr@gmail.com` with details and I will respond privately.
