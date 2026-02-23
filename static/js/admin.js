// ── TABS ──────────────────────────────────────────────────────
const TAB_TITLES = { profile:'Profile & Photo', education:'Education', skills:'Skills', experience:'Experience', projects:'Projects', research:'Research' };

document.querySelectorAll('.anav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.anav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    document.getElementById('page-title').textContent = TAB_TITLES[btn.dataset.tab];
  });
});

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => { t.className = 'toast'; }, 2800);
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────
function handlePhotoChange(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.size > 5 * 1024 * 1024) { toast('File too large (max 5MB)', 'error'); return; }

  // Show preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    const prev = document.getElementById('photo-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
    const placeholder = document.getElementById('photo-preview-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);

  // Upload
  const fd = new FormData();
  fd.append('photo', file);
  fetch('/api/upload-photo/', {
    method: 'POST',
    headers: { 'X-CSRFToken': getCsrf() },
    body: fd,
  })
  .then(r => r.json())
  .then(d => { if (d.ok) toast('✓ Photo uploaded'); else toast('Upload failed', 'error'); })
  .catch(() => toast('Upload error', 'error'));
}

// Drag-and-drop support
const dropArea = document.getElementById('photo-drop');
if (dropArea) {
  dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.style.borderColor = 'var(--border2)'; });
  dropArea.addEventListener('dragleave', () => { dropArea.style.borderColor = ''; });
  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('photo-file');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handlePhotoChange(input);
    }
  });
}

// ── HELPERS ───────────────────────────────────────────────────
function removeBlock(btn) { btn.closest('.item-block').remove(); }

function field(label, cls, value = '', full = false, textarea = false, placeholder = '') {
  const span = full ? ' field-group--full' : '';
  const ph = placeholder ? ` placeholder="${placeholder}"` : '';
  const input = textarea
    ? `<textarea class="${cls}" rows="3">${escHtml(value)}</textarea>`
    : `<input type="text" class="${cls}" value="${escHtml(value)}"${ph}/>`;
  return `<div class="field-group${span}"><label>${label}</label>${input}</div>`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function post(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
    body: JSON.stringify(data),
  });
  return res.json();
}

function getCsrf() {
  return document.cookie.split(';').map(c => c.trim())
    .find(c => c.startsWith('csrftoken='))?.split('=')[1] || '';
}

// ── ADD BLOCKS ────────────────────────────────────────────────
function makeBlock(title, fieldsHtml) {
  const div = document.createElement('div');
  div.className = 'item-block';
  div.innerHTML = `<div class="item-block-header">
    <span class="item-block-title">${title}</span>
    <button class="remove-btn" onclick="removeBlock(this)">Remove</button>
  </div><div class="field-grid">${fieldsHtml}</div>`;
  return div;
}

function addEducation() {
  document.getElementById('edu-list').appendChild(makeBlock('New Education',
    field('Institution', 'edu-institution', '', true) +
    field('Degree', 'edu-degree', '', true) +
    field('Location', 'edu-location') +
    field('Grade / GPA', 'edu-grade') +
    field('Year Range', 'edu-year', '', false, false, 'e.g. 2022 – 2026') +
    field('Link (optional)', 'edu-link') +
    field('Description (optional)', 'edu-desc', '', true, true)));
}

function addSkillCategory() {
  document.getElementById('skills-list').appendChild(makeBlock('New Category',
    field('Category Name', 'skill-cat-name', '', true) +
    field('Skills (comma separated)', 'skill-cat-items', '', true)));
}

function addExperience() {
  document.getElementById('exp-list').appendChild(makeBlock('New Experience',
    field('Company', 'exp-company') +
    field('Role / Title', 'exp-role') +
    field('Team / Department', 'exp-team', '', true) +
    field('Location', 'exp-location') +
    field('Company / Work Link', 'exp-link', '', false, false, 'https://company.com') +
    field('Start Date', 'exp-start', '', false, false, 'e.g. Jan 2023') +
    field('End Date', 'exp-end', 'Present') +
    field('Bullet Points (one per line)', 'exp-points', '', true, true)));
}

function addProject() {
  document.getElementById('proj-list').appendChild(makeBlock('New Project',
    field('Project Name', 'proj-name', '', true) +
    field('Tech Stack', 'proj-tech', '', true, false, 'e.g. C · Linux · System Calls') +
    field('Description', 'proj-desc', '', true, true) +
    field('GitHub Link', 'proj-github', '', false, false, 'https://github.com/...') +
    field('Live / Demo Link', 'proj-link', '', false, false, 'https://...')));
}

function addResearch() {
  document.getElementById('res-list').appendChild(makeBlock('New Research',
    field('Paper Title', 'res-title', '', true) +
    field('Publisher / Venue', 'res-publisher') +
    field('Year', 'res-year') +
    field('Description', 'res-desc', '', true, true) +
    field('Link (DOI / paper URL)', 'res-link', '', true, false, 'https://doi.org/...')));
}

// ── SAVE ─────────────────────────────────────────────────────
async function saveActive() {
  const active = document.querySelector('.anav-item.active').dataset.tab;
  const btn = document.getElementById('save-btn');
  btn.disabled = true; btn.textContent = 'Saving…';

  try {
    let data, url;

    if (active === 'profile') {
      url = '/api/profile/';
      data = {
        name:           document.getElementById('p-name').value,
        title:          document.getElementById('p-title').value,
        tagline:        document.getElementById('p-tagline').value,
        linkedin:       document.getElementById('p-linkedin').value,
        github:         document.getElementById('p-github').value,
        google_scholar: document.getElementById('p-scholar').value,
        twitter:        document.getElementById('p-twitter').value,
        website:        document.getElementById('p-website').value,
        resume_link:    document.getElementById('p-resume').value,
        stat1_value:    document.getElementById('p-s1v').value,
        stat1_label:    document.getElementById('p-s1l').value,
        stat2_value:    document.getElementById('p-s2v').value,
        stat2_label:    document.getElementById('p-s2l').value,
        stat3_value:    document.getElementById('p-s3v').value,
        stat3_label:    document.getElementById('p-s3l').value,
      };
    } else if (active === 'education') {
      url = '/api/education/';
      data = [...document.querySelectorAll('#edu-list .item-block')].map(b => ({
        institution: b.querySelector('.edu-institution').value,
        degree:      b.querySelector('.edu-degree').value,
        location:    b.querySelector('.edu-location').value,
        grade:       b.querySelector('.edu-grade').value,
        year:        b.querySelector('.edu-year').value,
        link:        b.querySelector('.edu-link').value,
        description: b.querySelector('.edu-desc').value,
      }));
    } else if (active === 'skills') {
      url = '/api/skills/';
      data = [...document.querySelectorAll('#skills-list .item-block')].map(b => ({
        name:   b.querySelector('.skill-cat-name').value,
        skills: b.querySelector('.skill-cat-items').value.split(',').map(s => s.trim()).filter(Boolean),
      }));
    } else if (active === 'experience') {
      url = '/api/experience/';
      data = [...document.querySelectorAll('#exp-list .item-block')].map(b => ({
        company:    b.querySelector('.exp-company').value,
        role:       b.querySelector('.exp-role').value,
        team:       b.querySelector('.exp-team').value,
        location:   b.querySelector('.exp-location').value,
        link:       b.querySelector('.exp-link').value,
        start_date: b.querySelector('.exp-start').value,
        end_date:   b.querySelector('.exp-end').value,
        points:     b.querySelector('.exp-points').value.split('\n').map(s => s.trim()).filter(Boolean),
      }));
    } else if (active === 'projects') {
      url = '/api/projects/';
      data = [...document.querySelectorAll('#proj-list .item-block')].map(b => ({
        name:        b.querySelector('.proj-name').value,
        tech:        b.querySelector('.proj-tech').value,
        description: b.querySelector('.proj-desc').value,
        github_link: b.querySelector('.proj-github').value,
        link:        b.querySelector('.proj-link').value,
      }));
    } else if (active === 'research') {
      url = '/api/research/';
      data = [...document.querySelectorAll('#res-list .item-block')].map(b => ({
        title:       b.querySelector('.res-title').value,
        publisher:   b.querySelector('.res-publisher').value,
        year:        b.querySelector('.res-year').value,
        description: b.querySelector('.res-desc').value,
        link:        b.querySelector('.res-link').value,
      }));
    }

    const result = await post(url, data);
    if (result.ok) toast('✓ Saved successfully');
    else toast('Something went wrong', 'error');
  } catch(e) {
    toast('Save failed', 'error');
    console.error(e);
  } finally {
    btn.disabled = false; btn.textContent = 'Save Changes';
  }
}
