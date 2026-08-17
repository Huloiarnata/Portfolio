# Writing for This Blog

Guest posts are welcome via pull request. This file explains the format,
the folder layout for series posts, how to add images and charts, and
how the metadata gets picked up by the site.

If you have not already, please read the top-level
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for the PR workflow and licensing.

---

## The two-file model

Every blog post is two things:

1. **A markdown file** in this directory holding the actual writing.
2. **An entry in `data/posts.json`** holding the metadata (title, date,
   author, tags, etc.) that the site uses to build blog cards and
   navigation.

Both must be present for the post to appear on the site.

---

## Single post

For a one-off post, drop a markdown file directly in `posts/`:

```
posts/
├── your-slug.md
```

Then add an entry to `data/posts.json`:

```json
{
  "slug": "your-slug",
  "title": "Your Post Title",
  "date": "2026-09-01",
  "excerpt": "One or two lines shown on blog cards.",
  "tags": ["distributed-systems", "performance"],
  "authors": [
    { "name": "Your Name", "url": "https://github.com/your-handle" }
  ],
  "featured": false,
  "order": 10,
  "visible": true
}
```

Fields:

| Field       | Type    | Required | Notes |
|-------------|---------|----------|-------|
| `slug`      | string  | yes      | Matches the filename (without `.md`). Must be URL-safe. |
| `title`     | string  | yes      | Shown as `<h1>` on the post page and on the card. |
| `date`      | string  | yes      | ISO date `YYYY-MM-DD`. Determines display date. |
| `excerpt`   | string  | yes      | Shown on cards; keep to ~2 lines. |
| `tags`      | array   | no       | Free-form; rendered as pills. |
| `authors`   | array   | no       | Each `{ name, url? }`. Pills appear under the title. |
| `featured`  | bool    | no       | If `true`, appears on the homepage blog preview. |
| `order`     | int     | no       | Lower = earlier in the list. Ties break by `date`. |
| `visible`   | bool    | no       | Default `true`. Set `false` to hide without deleting. |
| `series`    | string  | no       | See "Series" below. |
| `seriesOrder` | int   | no       | Position within a series. |

---

## Series (multiple posts on one topic)

If you're writing a **series** — for example, a build log for a drone
project — put every post into its own folder inside `posts/`:

```
posts/
├── drones/
│   ├── build-log-1.md
│   ├── build-log-2.md
│   └── build-log-3.md
```

Then in `data/posts.json`, use the **folder-qualified slug** and add a
`series` field:

```json
{
  "slug": "drones/build-log-1",
  "title": "Drone Build Log #1 — Frame & Motors",
  "date": "2026-09-01",
  "excerpt": "Choosing the frame, mounting motors, and first bench test.",
  "tags": ["hardware", "drones"],
  "authors": [{ "name": "Your Name", "url": "https://github.com/you" }],
  "series": "Drones",
  "seriesOrder": 1,
  "featured": false,
  "visible": true
}
```

- The `slug` matches the folder path relative to `posts/` (without `.md`).
- All posts in the series share the same `series` string.
- `seriesOrder` (integer) controls prev/next navigation between series
  posts on the post page.
- A "Series · Drones" pill appears above the title on both blog cards
  and the post page.

You can start a series, stop, and pick it up later — just add new
markdown files and JSON entries as you go.

---

## Markdown you can use

The site's parser is intentionally minimal. Supported syntax:

- Headings: `# H1` through `#### H4`
- Bold: `**bold**`  ·  Italic: `*italic*`  ·  Bold-italic: `***both***`
- Inline code: `` `code` ``
- Fenced code with language: <code>\`\`\`c ... \`\`\`</code>
- Links: `[text](url)`  ·  Images: `![alt](path)`
- Bullet lists: lines starting with `-` or `*`
- Blockquote: lines starting with `> `
- Horizontal rule: `---`

Anything more exotic (tables, footnotes, definition lists) is not
parsed and will render as raw text.

---

## Adding images

Place images under `img/blog/`, organized by post or series:

```
img/blog/
├── perf-latency/
│   └── p99-histogram.png
├── drones/
│   ├── frame-assembly.jpg
│   └── motor-wiring.jpg
```

Reference them from your markdown:

```markdown
![p99 latency histogram over 24h](img/blog/perf-latency/p99-histogram.png)
```

Keep image files **under 500 KB** each. Prefer WebP or optimized PNG/JPG.
If you have very large images, resize before committing — this repo is
served as a static site and every KB counts.

---

## Adding inline SVG charts

For diagrams, prefer **inline SVG** in the markdown. It renders crisply
at any size and inherits the site's theme colors. Use these tokens for
consistency (they work in both dark and light themes):

- Accent green: `#48d597` (dark) / `#1a8a56` (light)
- Text: use `currentColor` where possible
- Border: `#1e2e33`
- Warning yellow: `#fbbf24`
- Error red: `#f87171`

Example — a tiny bar chart:

```markdown
<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg">
  <text x="340" y="20" fill="#9ba2a8" font-size="11" text-anchor="middle">
    Requests per second by tier
  </text>
  <rect x="80"  y="60" width="80" height="120" fill="#48d597" opacity="0.5"/>
  <rect x="180" y="90" width="80" height="90"  fill="#48d597" opacity="0.7"/>
  <rect x="280" y="40" width="80" height="140" fill="#48d597"/>
</svg>
```

The site's CSS applies `max-width: 100%` to all SVGs inside `.prose`
so they scale responsively on mobile.

---

## Frontmatter (optional)

You may include a YAML frontmatter block at the top of your markdown
file. The parser strips it before rendering, so it's a convenient place
to keep notes for yourself:

```markdown
---
title: "Your Post Title"
date: 2026-09-01
tags: [systems, performance]
---

Your post content starts here.
```

The site does not currently use frontmatter for metadata — that all
lives in `data/posts.json`. The block is stripped safely, so include
it only if you want it.

---

## Checklist before you PR

- [ ] Markdown file is in `posts/` (or `posts/series-name/` for a series)
- [ ] Entry added to `data/posts.json` with correct slug
- [ ] `date` is ISO format (`YYYY-MM-DD`)
- [ ] Images are under `img/blog/`, sized reasonably
- [ ] SVGs use the site's color tokens
- [ ] `visible: true` (or omitted — defaults to true)
- [ ] Locally previewed the post page and it renders cleanly

Open the PR against `main`, describe the post in a sentence or two,
and I'll review it.

---

## What I look for when reviewing

- **Format compliance.** The metadata, filename, and folder placement
  match this guide.
- **Coherence.** Post is readable, follows a thread, doesn't ramble.
- **Factual claims.** If you cite numbers, benchmarks, or research,
  link the source in the post.
- **No plagiarism.** All text is your own or clearly attributed.
- **License clean.** Any images or code snippets you include are yours
  to publish, or are properly licensed for redistribution.

I do **not** review for opinion. Disagreement is welcome; well-argued
takes are the whole point.
