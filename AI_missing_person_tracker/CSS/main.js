/* ============================================================
   FindHome — AI Missing Person Tracker  |  app.js
   ============================================================ */

// ── DATA ────────────────────────────────────────────────────
const cases = [
  {
    id: 1, name: "Aditya Sharma", age: 17, gender: "Male",
    location: "Bengaluru, Karnataka", date: "Mar 14, 2026",
    status: "missing",
    height: "5'7\"", weight: "62 kg", hair: "Black", eyes: "Brown",
    desc: "Last seen near Majestic Bus Stand wearing a grey hoodie and black jeans. May be carrying a red backpack.",
    contact: "9900-XXXX-99", aiMatch: 94, photo: "👦"
  },
  {
    id: 2, name: "Priya Menon", age: 34, gender: "Female",
    location: "Chennai, Tamil Nadu", date: "Mar 10, 2026",
    status: "active",
    height: "5'4\"", weight: "57 kg", hair: "Long black", eyes: "Dark brown",
    desc: "Missing after not returning from work. Last seen at T. Nagar metro station around 8 PM. Wearing office attire.",
    contact: "7788-XXXX-11", aiMatch: 88, photo: "👩"
  },
  {
    id: 3, name: "Rajan Patel", age: 68, gender: "Male",
    location: "Ahmedabad, Gujarat", date: "Mar 8, 2026",
    status: "missing",
    height: "5'6\"", weight: "75 kg", hair: "Grey", eyes: "Brown",
    desc: "Elderly man with early-stage dementia. Went for a morning walk and did not return. Wearing a white kurta.",
    contact: "9812-XXXX-34", aiMatch: 91, photo: "👴"
  },
  {
    id: 4, name: "Kavya Reddy", age: 12, gender: "Female",
    location: "Hyderabad, Telangana", date: "Mar 16, 2026",
    status: "missing",
    height: "4'9\"", weight: "40 kg", hair: "Black braided", eyes: "Dark",
    desc: "Did not return from school. Last seen boarding a blue auto-rickshaw outside St. Mary's School.",
    contact: "8765-XXXX-22", aiMatch: 97, photo: "👧"
  },
  {
    id: 5, name: "Sameer Khan", age: 26, gender: "Male",
    location: "Mumbai, Maharashtra", date: "Mar 5, 2026",
    status: "found",
    height: "5'10\"", weight: "72 kg", hair: "Short black", eyes: "Brown",
    desc: "Was found safe at Dadar railway station on March 18. Reunited with family.",
    contact: "—", aiMatch: 99, photo: "👨"
  },
  {
    id: 6, name: "Lakshmi Iyer", age: 45, gender: "Female",
    location: "Coimbatore, Tamil Nadu", date: "Mar 12, 2026",
    status: "active",
    height: "5'3\"", weight: "60 kg", hair: "Medium black", eyes: "Black",
    desc: "Missing after a family dispute. Has relatives in Erode and Madurai. May be travelling by bus.",
    contact: "9000-XXXX-55", aiMatch: 82, photo: "👩"
  },
  {
    id: 7, name: "Arjun Nair", age: 19, gender: "Male",
    location: "Kochi, Kerala", date: "Mar 17, 2026",
    status: "missing",
    height: "5'9\"", weight: "68 kg", hair: "Wavy brown", eyes: "Light brown",
    desc: "College student who went missing after a late-night party. Phone switched off. Last location near Marine Drive.",
    contact: "9988-XXXX-77", aiMatch: 89, photo: "👦"
  },
  {
    id: 8, name: "Divya Subramaniam", age: 8, gender: "Female",
    location: "Pune, Maharashtra", date: "Mar 15, 2026",
    status: "missing",
    height: "4'2\"", weight: "28 kg", hair: "Short black", eyes: "Brown",
    desc: "Last seen playing outside her apartment in Kothrud area. Wearing a yellow frock with flowers.",
    contact: "7766-XXXX-44", aiMatch: 95, photo: "👧"
  }
];

// ── RENDER CARDS ─────────────────────────────────────────────
function renderCards(data) {
  const grid = document.getElementById('cases-grid');
  document.getElementById('result-count').innerHTML =
    `<strong>${data.length}</strong> cases`;

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">No cases match your filters.</div>
      </div>`;
    return;
  }

  grid.innerHTML = data.map((c, i) => `
    <div class="person-card" style="animation-delay:${i * 0.05}s" onclick="openDetail(${c.id})">
      <div style="position:relative">
        <div class="card-photo-placeholder">${c.photo}</div>
        <div class="card-status status-${c.status === 'active' ? 'active' : c.status === 'found' ? 'found' : 'missing'}">
          ${c.status === 'active' ? 'Active Search' : c.status === 'found' ? '✓ Found' : 'Missing'}
        </div>
      </div>
      <div class="card-body">
        <div class="card-name">${c.name}</div>
        <div class="card-meta">
          <span>🎂 Age ${c.age}</span>
          <span>📍 ${c.location.split(',')[0]}</span>
        </div>
        <div class="card-desc">${c.desc}</div>
        <div class="card-footer">
          <div class="card-date">Reported ${c.date}</div>
          <button class="card-action"
            onclick="event.stopPropagation(); openDetail(${c.id})">
            View Case →
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTERS ──────────────────────────────────────────────────
function applyFilters() {
  const search = document.querySelector('.search-input').value.toLowerCase();
  const filtered = cases.filter(c =>
    c.name.toLowerCase().includes(search) ||
    c.location.toLowerCase().includes(search) ||
    c.desc.toLowerCase().includes(search)
  );
  renderCards(filtered);
}

// ── DETAIL MODAL ─────────────────────────────────────────────
function openDetail(id) {
  const c = cases.find(x => x.id === id);
  document.getElementById('detail-title').textContent = c.name;

  document.getElementById('detail-body').innerHTML = `
    <div class="detail-photo">${c.photo}</div>
    <div class="detail-name">${c.name}</div>
    <div class="detail-status">
      <span class="card-status status-${c.status === 'active' ? 'active' : c.status === 'found' ? 'found' : 'missing'}"
            style="position:static">
        ${c.status === 'active' ? 'Active Search' : c.status === 'found' ? '✓ Found' : 'Missing'}
      </span>
    </div>
    ${c.status !== 'found' ? `
      <div class="ai-match-badge">
        ✦ <strong>${c.aiMatch}% AI match confidence</strong>
        — Cross-referenced with 2,800+ active cases
      </div>` : ''}
    <div class="detail-grid">
      <div class="detail-field">
        <div class="detail-field-label">Age</div>
        <div class="detail-field-value">${c.age} years old</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Gender</div>
        <div class="detail-field-value">${c.gender}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Height</div>
        <div class="detail-field-value">${c.height}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Weight</div>
        <div class="detail-field-value">${c.weight}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Hair</div>
        <div class="detail-field-value">${c.hair}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Eyes</div>
        <div class="detail-field-value">${c.eyes}</div>
      </div>
      <div class="detail-field" style="grid-column:1/-1">
        <div class="detail-field-label">Last Seen</div>
        <div class="detail-field-value">${c.location} — ${c.date}</div>
      </div>
    </div>
    <p class="detail-desc">${c.desc}</p>
    ${c.status !== 'found' ? `
      <button class="contact-btn"
        onclick="showToast('📞 Connecting you to the reporting contact…')">
        Contact Reporter
      </button>
      <button class="contact-btn" style="background:var(--accent-2)"
        onclick="showToast('✓ Tip submitted. Thank you!')">
        Submit a Tip
      </button>
    ` : `
      <button class="contact-btn" style="background:var(--green)">
        ✓ This person has been found
      </button>
    `}
  `;

  openModal('detail-modal');
}

// ── AI SEARCH ─────────────────────────────────────────────────
function runAISearch() {
  const query = document.getElementById('ai-query').value.trim();
  if (!query) {
    showToast('Please describe what you know to search.');
    return;
  }

  const btn = document.querySelector('.ai-btn');
  btn.innerHTML = '<span style="animation:pulse 1s infinite">✦</span> Analyzing…';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>✦</span> Search with AI';
    btn.disabled = false;

    const result  = document.getElementById('ai-result');
    const body    = document.getElementById('ai-result-body');
    const matches = document.getElementById('ai-result-matches');

    body.innerHTML = `
      Based on your description, I analyzed <strong>2,847 active cases</strong>
      using semantic matching, physical feature cross-referencing, and location
      proximity scoring. I found <strong>${Math.floor(Math.random() * 3) + 2}
      probable matches</strong> ranked by confidence. The closest matches are
      highlighted below — click any to view full details.
    `;

    const topMatches = cases
      .filter(c => c.status !== 'found')
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    matches.innerHTML = topMatches
      .map(c => `
        <div class="match-chip" onclick="openDetail(${c.id})">
          ${c.photo} ${c.name} — ${c.aiMatch}% match
        </div>`)
      .join('');

    result.classList.add('visible');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1600);
}

// ── HINT CHIPS ────────────────────────────────────────────────
function fillHint(el) {
  document.getElementById('ai-query').value = el.textContent.trim();
}

// ── MODAL HELPERS ─────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) closeModal(m.id);
  });
});

// ── REPORT SUBMIT ─────────────────────────────────────────────
function submitReport() {
  closeModal('report-modal');
  showToast('✓ Report submitted. Authorities have been notified.');
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── TAB NAVIGATION ────────────────────────────────────────────
function setTab(el, tab) {
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  el.classList.add('active');

  if (tab === 'resolved') {
    renderCards(cases.filter(c => c.status === 'found'));
  } else if (tab === 'browse') {
    renderCards(cases);
  } else {
    showToast('🗺️ Map view coming soon');
  }
}

// ── INIT ──────────────────────────────────────────────────────
renderCards(cases);