# img/blog/ — Blog Post Images

Images used inside blog posts. Contributor-editable via pull request.

## Layout

Organize by post slug or series name so each post's assets stay together:

```
img/blog/
├── perf-latency/
│   └── p99-histogram.png
├── drones/
│   ├── frame.jpg
│   └── wiring-diagram.svg
└── your-post-slug/
    └── your-image.png
```

## Rules

- Keep each file under **500 KB**. Resize or convert to WebP before committing.
- Reference from markdown with a repo-relative path:
  ```markdown
  ![p99 latency histogram](img/blog/perf-latency/p99-histogram.png)
  ```
- For diagrams and charts, **inline SVG in the markdown** is preferred over
  raster files — it inherits the site theme colors. See
  [`posts/README.md`](../../posts/README.md) for examples.

## What NOT to put here

- Personal photos of the site owner (those live in [`img/site/`](../site/))
- Third-party images you don't have the right to redistribute
