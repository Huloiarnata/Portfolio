# Portfolio Site — Content Guide

How to add, update, and remove content on the portfolio site.

---

## Blog Posts

Blog posts are markdown files in `posts/` with metadata in `data/posts.json`.

### Adding a new post

1. Create a markdown file in `posts/` named `your-slug.md`:

```markdown
---
title: "Your Post Title"
date: 2026-08-18
tags: [systems, performance]
---

Your content here. Supports **bold**, *italic*, `code`, links, images, and more.
```

2. Add an entry to `data/posts.json`:

```json
{
  "slug": "your-slug",
  "title": "Your Post Title",
  "date": "2026-08-18",
  "excerpt": "A short description shown on blog cards.",
  "tags": ["systems", "performance"],
  "visible": true
}
```

3. Deploy (push to main, GitHub Actions handles the rest).

### Adding collaborators/authors to a post

Add an `authors` array to the post entry in `data/posts.json`:

```json
{
  "slug": "your-slug",
  "title": "Your Post Title",
  "date": "2026-08-18",
  "excerpt": "...",
  "tags": ["systems"],
  "authors": [
    { "name": "Ronit Kumar", "url": "https://github.com/Huloiarnata" },
    { "name": "Collaborator Name", "url": "https://github.com/their-username" }
  ],
  "visible": true
}
```

- `name` (required): display name
- `url` (optional): link to their profile (GitHub, LinkedIn, etc.)
- If no `authors` field, the post shows without author attribution
- Authors appear as clickable pills on the post page and as a byline on blog cards

### Adding images to a post

Place images in `img/blog/` (create the directory if needed), then reference them in your markdown:

```markdown
![Alt text](img/blog/your-image.png)
```

### Adding inline SVG charts

Paste SVG directly into your markdown. Use the site's color scheme for consistency:

- Accent green: `#48d597` (dark) / `#1a8a56` (light)
- Text colors: `#9ba2a8` (secondary), `#5e6b73` (tertiary)
- Border: `#1e2e33`
- Warning yellow: `#fbbf24`
- Error red: `#f87171`

Example:

```markdown
<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg">
  <text x="340" y="24" fill="#9ba2a8" font-size="11" text-anchor="middle">Chart Title</text>
  <!-- your chart elements -->
</svg>
```

The `.prose svg` style ensures charts are responsive (`max-width: 100%`).

### Hiding a post (without deleting)

Set `"visible": false` in `data/posts.json`. The file stays in `posts/` but won't appear on the site.

### Deleting a post

1. Remove the entry from `data/posts.json`
2. Delete the markdown file from `posts/`

---

## Projects

Projects are in `data/projects.json`. They're merged with GitHub repos in one combined section.

### Adding a project

Add an entry to `data/projects.json`:

```json
{
  "name": "Project Name",
  "description": "Short description of the project.",
  "tags": ["C", "Linux", "Kernel"],
  "status": "active",
  "url": "https://github.com/you/repo",
  "visible": true,
  "order": 1
}
```

- `status`: `"active"`, `"in-progress"`, `"planned"`, or `"archived"`
- `url` (optional): external link. Cards without a URL are not clickable.
- `tags`: first tag is used as the primary language for the language dot
- `visible`: set to `false` to hide without deleting
- `order`: sorting priority (lower = shown first). The homepage shows only the top 3; all projects appear on `projects.html`

### Hiding a GitHub repo

Add the repo name to `hiddenRepos` in `data/config.json`:

```json
{
  "hiddenRepos": ["Portfolio", "some-private-repo"]
}
```

### Setting GitHub repo status badges

Add entries to `repoStatus` in `data/config.json`:

```json
{
  "repoStatus": {
    "Heap_Memory_Manager": "active",
    "neetcode-submissions": "in-progress",
    "ExploringGo": "in-progress"
  }
}
```

---

## Research & Publications

### Your publications

Edit the HTML directly in `index.html` inside the `<div class="pub-grid">` section. Each publication is a `<div class="pub-item">`:

```html
<div class="pub-item">
  <div>
    <div class="pub-venue">CONFERENCE YEAR &bull; PUBLISHER</div>
    <div class="pub-title">Paper Title</div>
    <div class="pub-desc">Short description.</div>
  </div>
  <span class="pub-status published">Published</span>
</div>
```

Status classes: `published` (green accent) or no class (default gray for "Accepted", "Under Review", etc.)

### Recommended papers

Edit `data/papers.json`:

```json
{
  "title": "Paper Title",
  "authors": "Author1, Author2",
  "url": "https://link-to-paper",
  "category": "systems",
  "visible": true
}
```

---

## Experience

Edit the timeline HTML directly in `index.html` inside the `<div class="timeline">` section.

- Use class `current` for current positions, `past` for previous ones
- The last timeline item automatically hides its left border

### Adding a link to a project/release

Add a `timeline-links` div inside the timeline item:

```html
<div class="timeline-links">
  <a href="https://link" target="_blank" rel="noopener" class="timeline-link">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
    Link Label
  </a>
</div>
```

---

## Comments (Giscus)

Comments use [Giscus](https://giscus.app), which requires setup:

1. **Enable GitHub Discussions** on your repository (Settings > Features > Discussions)
2. Go to [giscus.app](https://giscus.app) and configure:
   - Repository: `Huloiarnata/Portfolio`
   - Page mapping: `pathname`
   - Category: `Comments` (create this category in Discussions)
3. Copy the `data-repo-id` and `data-category-id` values
4. Update `post.html` — find the `loadGiscus()` function and fill in:

```javascript
script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
```

Without these IDs, comments will show the "giscus is not installed" error.

---

## Site Configuration

`data/config.json` controls global settings:

```json
{
  "name": "Ronit Kumar",
  "title": "Software Engineer — PowerScale, Dell Technologies",
  "email": "ronit.kumar710.nr@gmail.com",
  "links": {
    "linkedin": "https://linkedin.com/in/RonitKumar",
    "github": "https://github.com/Huloiarnata",
    "scholar": "https://scholar.google.com/citations?user=RonitKumar",
    "leetcode": "https://leetcode.com/RonitKumar"
  },
  "hiddenRepos": ["Portfolio"],
  "repoStatus": { ... },
  "blogRepo": "blog-content"
}
```

---

## Theme

Toggle between dark/light using the moon/sun icon in the nav. The choice is saved in localStorage.

- Dark theme is the default
- Light theme uses green accent `#1a8a56` instead of `#48d597`
- All colors are CSS custom properties in `css/style.css` under `:root` (dark) and `[data-theme="light"]`

---

## Deployment

The site is static HTML/CSS/JS — no build step needed.

- Push to `main` branch
- GitHub Pages serves the site automatically
- All data files (`data/*.json`) and posts (`posts/*.md`) are fetched at runtime

---

## File Structure

```
├── index.html          # Main page
├── blog.html           # Blog listing
├── post.html           # Blog post renderer
├── projects.html       # All projects listing
├── css/style.css       # All styles
├── js/main.js          # All JavaScript
├── img/                # Images (profile, blog images)
│   └── profile.jpg     # Hero profile photo
├── data/
│   ├── config.json     # Site config, hidden repos, repo statuses
│   ├── projects.json   # Project cards
│   ├── papers.json     # Recommended papers
│   └── posts.json      # Blog post metadata + authors
├── posts/
│   ├── hello-world.md  # Blog post content
│   └── perf-distributed-systems.md
└── GUIDE.md            # This file
```
