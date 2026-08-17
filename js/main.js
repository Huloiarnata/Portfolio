document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initNavScroll();
  initScrollReveal();
  initActiveNav();
  initMeteors();
  loadProjectsAndRepos();
  loadPapers();
  loadPublications();
  loadBlogPreview();
  loadBlogList();
  loadSeriesPage();
});

// Homepage detected by presence of hero. Homepage renders only `featured` items;
// dedicated view-all pages render everything.
function isHomePage() { return !!document.querySelector('.hero'); }

let blogFilter = 'all'; // 'all' | 'series' | 'posts'

// ===== THEME =====
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
}

// ===== NAV =====
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }
}

function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ===== ACTIVE NAV =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navAnchors.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          const link = document.querySelector('.nav-links a[href="#' + id + '"]');
          if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== METEORS =====
function initMeteors() {
  const container = document.querySelector('.meteors');
  if (!container) return;

  const meteorCount = 18;
  for (let i = 0; i < meteorCount; i++) {
    const m = document.createElement('div');
    m.className = 'meteor';
    m.style.height = (120 + Math.random() * 160) + 'px';
    m.style.left = (-15 + Math.random() * 80) + '%';
    m.style.top = -(Math.random() * 200) + 'px';
    m.style.animationDuration = (2.8 + Math.random() * 4.5).toFixed(2) + 's';
    m.style.animationDelay = (Math.random() * 16).toFixed(2) + 's';
    container.appendChild(m);
  }
}

// ===== PROJECTS + REPOS (MERGED) =====
const GITHUB_USER = 'Huloiarnata';
const LANG_COLORS = {
  C: '#555555', 'C++': '#f34b7d', Python: '#3572A5', Go: '#00ADD8',
  Dart: '#00B4AB', JavaScript: '#f1e05a', HTML: '#e34c26',
  'Jupyter Notebook': '#DA5B0B', SQL: '#e38c00', Shell: '#89e051'
};

const CARD_ICONS = ['{ }', '> _', '[ ]', '#!/', '0x', ':::', 'fn()', '/**/', '<<>>', '#!'];
const BLOG_ICONS = ['///', '...', '> _', '[ ]', '===', '***', '---', '>>>'];

async function loadProjectsAndRepos() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  try {
    const [projectsRes, reposRes, configRes] = await Promise.all([
      fetch('data/projects.json'),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`).catch(() => null),
      fetch('data/config.json').catch(() => null)
    ]);

    const projects = projectsRes.ok ? await projectsRes.json() : [];
    const repos = reposRes && reposRes.ok ? await reposRes.json() : [];
    const config = configRes && configRes.ok ? await configRes.json() : {};
    const hiddenRepos = config.hiddenRepos || [];
    const repoStatus = config.repoStatus || {};

    const projectNamesNorm = new Set(projects.map(p => p.name.toLowerCase().replace(/[\s_-]+/g, '')));

    const ghCards = repos
      .filter(r => !r.fork && !hiddenRepos.includes(r.name) && !projectNamesNorm.has(r.name.toLowerCase().replace(/[\s_-]+/g, '')))
      .slice(0, 4)
      .map(r => ({
        name: r.name.replace(/[-_]/g, ' '),
        description: r.description || '',
        language: r.language,
        status: repoStatus[r.name] || 'active',
        url: r.html_url,
        stars: r.stargazers_count,
        source: 'github'
      }));

    const projectCards = projects
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999))
      .map(p => ({
        name: p.name,
        description: p.description || '',
        language: p.tags?.[0] || null,
        status: p.status || 'active',
        url: p.url || null,
        stars: 0,
        source: 'project',
        tags: p.tags,
        order: p.order || 999,
        featured: p.featured === true
      }));

    const allCards = [...projectCards, ...ghCards];

    if (!allCards.length) {
      grid.innerHTML = '<div class="blog-empty"><p>// no projects to show</p></div>';
      return;
    }

    // Homepage: only cards where featured=true (or GitHub repos, which are opt-in via config).
    // View-all page: everything.
    const displayCards = isHomePage()
      ? allCards.filter(c => c.featured === true)
      : allCards;

    grid.innerHTML = displayCards.map((p, i) => {
      const color = LANG_COLORS[p.language] || '#48d597';
      const icon = CARD_ICONS[i % CARD_ICONS.length];
      const lang = p.source === 'github' ? p.language : (p.tags?.[0] || null);
      const langColor = LANG_COLORS[lang] || color;

      return `
        <${p.url ? `a href="${p.url}" target="_blank" rel="noopener"` : 'div'} class="project-card">
          <div class="project-card-img">
            <div class="project-card-img-inner" style="background: linear-gradient(135deg, ${langColor}11 0%, ${langColor}05 100%); color: ${langColor};">${esc(icon)}</div>
          </div>
          <div class="project-card-body">
            <div class="project-card-header">
              <span class="project-status ${p.status}">${statusLabel(p.status)}</span>
            </div>
            <div class="project-name">${esc(p.name)}</div>
            <div class="project-desc">${esc(p.description)}</div>
            <div class="project-footer">
              ${lang ? `<span class="project-lang"><span class="lang-dot" style="background:${langColor}"></span>${esc(lang)}</span>` : '<span></span>'}
              ${p.url ? `<span class="project-link-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>View</span>` : ''}
            </div>
          </div>
        </${p.url ? 'a' : 'div'}>
      `;
    }).join('');
  } catch {
    grid.innerHTML = '<div class="blog-empty"><p>// could not load projects</p></div>';
  }
}

function statusLabel(s) {
  const labels = { active: 'Active', 'in-progress': 'In Progress', planned: 'Planned', archived: 'Archived' };
  return labels[s] || labels.active;
}

// ===== PAPERS =====
async function loadPapers() {
  const list = document.getElementById('papersList');
  if (!list) return;

  try {
    const res = await fetch('data/papers.json?' + Date.now());
    if (!res.ok) throw new Error();
    const papers = await res.json();
    const visible = papers
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    if (!visible.length) throw new Error();

    const display = isHomePage() ? visible.filter(p => p.featured === true) : visible;

    list.innerHTML = display.map(p => `
      <${p.url ? `a href="${p.url}" target="_blank" rel="noopener"` : 'div'} class="paper-item">
        <div>
          <div class="paper-title">${esc(p.title)}</div>
          <div class="paper-authors">${esc(p.authors || '')}</div>
        </div>
        <span class="paper-tag">${esc(p.category || 'paper')}</span>
      </${p.url ? 'a' : 'div'}>
    `).join('');
  } catch {
    list.innerHTML = '<div class="paper-item"><div><div class="paper-title" style="color:var(--text-tertiary)">// add papers to data/papers.json</div></div><span class="paper-tag">setup</span></div>';
  }
}

// ===== PUBLICATIONS =====
async function loadPublications() {
  const grid = document.getElementById('pubGrid');
  if (!grid) return;

  try {
    const res = await fetch('data/publications.json?' + Date.now());
    if (!res.ok) throw new Error();
    const pubs = await res.json();
    const sorted = pubs
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    if (!sorted.length) throw new Error();

    const display = isHomePage() ? sorted.filter(p => p.featured === true) : sorted;

    grid.innerHTML = display.map(p => {
      const venue = [p.venue, p.publisher].filter(Boolean).join(' • ');
      const statusClass = p.status === 'published' ? 'published' : '';
      const statusLabel = p.status
        ? p.status.charAt(0).toUpperCase() + p.status.slice(1)
        : 'Accepted';
      // Read Paper button only for published work — accepted-but-not-yet-in-proceedings
      // items shouldn't claim a paper is available.
      const canRead = p.status === 'published' && p.url;
      const inner = `
        <div>
          <div class="pub-venue">${esc(venue)}</div>
          <div class="pub-title">${esc(p.title)}</div>
          <div class="pub-desc">${esc(p.description || '')}</div>
          ${canRead ? `<a href="${p.url}" target="_blank" rel="noopener" class="pub-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Read paper
          </a>` : ''}
        </div>
        <span class="pub-status ${statusClass}">${esc(statusLabel)}</span>
      `;
      return `<div class="pub-item">${inner}</div>`;
    }).join('');
  } catch {
    grid.innerHTML = '<div class="blog-empty"><p>// no publications listed</p></div>';
  }
}

// ===== BLOG =====
// Series posts are bundled into a single "series card" on the blog listing
// and homepage preview. The card links to series.html?name=<Series>.
async function loadBlogPreview() {
  const container = document.getElementById('blogPreview');
  if (!container) return;

  try {
    const res = await fetch('data/posts.json?' + Date.now());
    if (!res.ok) throw new Error();
    const posts = await res.json();
    const visible = posts
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    if (!visible.length) throw new Error();

    // Featured = individually featured post OR a series where the first part is featured
    const featured = visible.filter(p => p.featured === true);
    container.innerHTML = collapseSeries(featured, visible).map((c, i) => renderCard(c, i)).join('');
  } catch {
    container.innerHTML = '<div class="blog-empty"><p>// no posts yet — check back soon</p></div>';
  }
}

async function loadBlogList() {
  const container = document.getElementById('blogList');
  if (!container) return;

  let allPosts = [];

  function render() {
    const visible = allPosts
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    let cards = collapseSeries(visible, visible);
    if (blogFilter === 'series') cards = cards.filter(c => c.kind === 'series');
    else if (blogFilter === 'posts') cards = cards.filter(c => c.kind === 'post');
    container.innerHTML = cards.length
      ? cards.map((c, i) => renderCard(c, i)).join('')
      : '<div class="blog-empty"><p>// nothing here yet</p></div>';
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      blogFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
  });

  try {
    const res = await fetch('data/posts.json?' + Date.now());
    if (!res.ok) throw new Error();
    allPosts = await res.json();
    render();
  } catch {
    container.innerHTML = '<div class="blog-empty"><p>// no posts yet — check back soon</p></div>';
  }
}

// Fold a list of posts into a list of cards, bundling every series into a single
// series-card. `pool` is the full visible post set — a series card includes ALL
// parts from the pool, not just those in the input list.
function collapseSeries(list, pool) {
  const cards = [];
  const seen = new Set();
  for (const p of list) {
    if (p.series) {
      if (seen.has(p.series)) continue;
      seen.add(p.series);
      const parts = pool
        .filter(q => q.series === p.series)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
      cards.push({ kind: 'series', name: p.series, parts });
    } else {
      cards.push({ kind: 'post', post: p });
    }
  }
  return cards;
}

function renderCard(card, i) {
  return card.kind === 'series'
    ? renderSeriesCard(card.name, card.parts, i)
    : renderBlogCard(card.post, i);
}

function renderCardFooter(date, authors) {
  const displayAuthors = authors.slice(0, 3);
  const authHtml = displayAuthors.length ? `<span class="blog-card-authors">by ${esc(displayAuthors.join(', '))}</span>` : '';
  return `
    <div class="blog-card-footer">
      <div class="blog-card-meta">
        <span class="blog-card-date">${formatDate(date)}</span>
        ${authHtml}
      </div>
    </div>
  `;
}

function renderSeriesCard(name, parts, i) {
  const icon = BLOG_ICONS[i % BLOG_ICONS.length];
  const latest = parts.reduce((a, b) => (a.date > b.date ? a : b));
  const authorSet = new Set();
  parts.forEach(p => (p.authors || []).forEach(a => authorSet.add(typeof a === 'string' ? a : a.name)));
  const authors = Array.from(authorSet);
  const first = parts[0];
  return `
    <a href="series.html?name=${encodeURIComponent(name)}" class="blog-card blog-series-card">
      <div class="blog-card-img blog-card-img-series">
        <div class="blog-card-img-inner">${esc(icon)}</div>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-title">${esc(name)}</div>
        <div class="blog-card-excerpt">${esc(first.excerpt || '')} A ${parts.length}-part series &mdash; open to read all entries.</div>
      </div>
      ${renderCardFooter(latest.date, authors)}
    </a>
  `;
}

async function loadSeriesPage() {
  const container = document.getElementById('seriesList');
  if (!container) return;

  const name = new URLSearchParams(location.search).get('name');
  const titleEl = document.getElementById('seriesTitle');
  const introEl = document.getElementById('seriesIntro');

  if (!name) {
    titleEl && (titleEl.textContent = 'Series not found');
    container.innerHTML = '<div class="blog-empty"><p>// no series specified</p></div>';
    return;
  }

  try {
    const res = await fetch('data/posts.json?' + Date.now());
    const posts = await res.json();
    const parts = posts
      .filter(p => p.visible !== false && p.series === name)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

    if (!parts.length) throw new Error();

    document.title = name + ' — Series — Ronit Kumar';
    titleEl && (titleEl.textContent = name);

    const authorSet = new Set();
    parts.forEach(p => (p.authors || []).forEach(a => authorSet.add(typeof a === 'string' ? a : a.name)));
    const authors = Array.from(authorSet);
    if (introEl) {
      introEl.innerHTML = `A ${parts.length}-part series` +
        (authors.length ? ` by <span class="series-authors">${esc(authors.join(', '))}</span>` : '') +
        `. Read in order or jump to any part.`;
    }

    container.innerHTML = parts.map((p, i) => `
      <a href="post.html?slug=${encodeURIComponent(p.slug)}" class="series-part">
        <div class="series-part-num">Part ${p.seriesOrder || (i + 1)}</div>
        <div class="series-part-body">
          <div class="series-part-title">${esc(p.title.replace(/^.*?—\s*/, ''))}</div>
          <div class="series-part-excerpt">${esc(p.excerpt || '')}</div>
          <div class="series-part-meta">
            <span class="series-part-date">${formatDate(p.date)}</span>
            ${p.tags ? `<div class="series-part-tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
        <div class="series-part-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </a>
    `).join('');
  } catch {
    titleEl && (titleEl.textContent = 'Series not found');
    container.innerHTML = '<div class="blog-empty"><p>// this series could not be loaded</p></div>';
  }
}

function renderBlogCard(post, i) {
  const icon = BLOG_ICONS[i % BLOG_ICONS.length];
  const authors = (post.authors ? post.authors.map(a => (a.name || a)) : []).slice(0, 3);
  return `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card">
      <div class="blog-card-img">
        <div class="blog-card-img-inner">${esc(icon)}</div>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-title">${esc(post.title)}</div>
        <div class="blog-card-excerpt">${esc(post.excerpt || '')}</div>
      </div>
      ${renderCardFooter(post.date, authors)}
    </a>
  `;
}

// ===== HELPERS =====
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

function esc(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
