// ── MOBILE SIDEBAR ───────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mob-overlay');
const openBtn = document.getElementById('mob-open');

openBtn?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
});

// ── ACTIVE NAV ON SCROLL ─────────────────────────────────────
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-item[data-section]')];

const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-item[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => scrollSpy.observe(s));

// ── FADE-UP ANIMATION ────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 3) * 55}ms`;
      entry.target.classList.add('in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── SMOOTH SIDEBAR LINK CLOSE ON MOBILE ─────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay?.classList.remove('visible');
  });
});
