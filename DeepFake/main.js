/**
 * SENTINEL — DeepFake Detection System
 * main.js
 *
 * Responsibilities:
 *  - Clock
 *  - File upload / drag-and-drop
 *  - Demo mode (authentic / deepfake sample)
 *  - Analysis pipeline (simulated)
 *  - Results rendering (verdict, metrics, freq chart, face map)
 *  - Reset
 */

'use strict';

/* ── State ──────────────────────────────────────────────────── */
const state = {
  demoMode: null,   // 'real' | 'fake' | null
  hasFile:  false,
};

/* ── DOM refs ───────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const dom = {
  sysTime:        $('sys-time'),
  uploadZone:     $('upload-zone'),
  fileInput:      $('file-input'),
  btnReal:        $('btn-real'),
  btnFake:        $('btn-fake'),
  previewPane:    $('preview-pane'),
  previewHolder:  $('preview-placeholder'),
  previewCanvas:  $('preview-canvas'),
  scanOverlay:    $('scan-overlay'),
  analyzeBtn:     $('analyze-btn'),
  loadingState:   $('loading-state'),
  loadingText:    $('loading-text'),
  loadingFill:    $('loading-fill'),
  resultsSection: $('results-section'),
  logPanel:       $('log-panel'),
  verdictCard:    $('verdict-card'),
  verdictIcon:    $('verdict-icon'),
  verdictLabel:   $('verdict-label'),
  verdictDesc:    $('verdict-desc'),
  confNum:        $('conf-num'),
  metricsGrid:    $('metrics-grid'),
  freqChart:      $('freq-chart'),
  anomalyDots:    $('anomaly-dots'),
  resetBtn:       $('reset-btn'),
};

/* ── Clock ──────────────────────────────────────────────────── */
function updateClock() {
  const n = new Date();
  const pad = v => String(v).padStart(2, '0');
  dom.sysTime.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ── Upload helpers ─────────────────────────────────────────── */
function setFileReady() {
  state.hasFile = true;
  dom.analyzeBtn.disabled = false;
}

function showCanvasPreview() {
  dom.previewHolder.style.display = 'none';
  dom.previewCanvas.style.display = 'block';
}

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      dom.previewCanvas.width  = img.width;
      dom.previewCanvas.height = img.height;
      dom.previewCanvas.getContext('2d').drawImage(img, 0, 0);
      showCanvasPreview();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleVideoFile(file) {
  const canvas = dom.previewCanvas;
  canvas.width = 300; canvas.height = 200;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0c1628';
  ctx.fillRect(0, 0, 300, 200);
  ctx.fillStyle = '#4a6080';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VIDEO: ' + file.name,               150, 100);
  ctx.fillText(Math.round(file.size / 1024) + ' KB', 150, 120);
  showCanvasPreview();
}

function handleFile(file) {
  state.demoMode = null;
  setFileReady();
  if (file.type.startsWith('image/')) handleImageFile(file);
  else                                handleVideoFile(file);
}

/* ── Upload events ──────────────────────────────────────────── */
dom.uploadZone.addEventListener('click', () => dom.fileInput.click());

dom.uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  dom.uploadZone.classList.add('drag-over');
});

dom.uploadZone.addEventListener('dragleave', () => {
  dom.uploadZone.classList.remove('drag-over');
});

dom.uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  dom.uploadZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

dom.fileInput.addEventListener('change', () => {
  if (dom.fileInput.files[0]) handleFile(dom.fileInput.files[0]);
});

/* ── Demo mode ──────────────────────────────────────────────── */
function drawDemoFace(type) {
  const canvas = dom.previewCanvas;
  canvas.width = 300; canvas.height = 240;
  const ctx = canvas.getContext('2d');
  const isFake = type === 'fake';

  ctx.fillStyle = '#080f1c';
  ctx.fillRect(0, 0, 300, 240);

  // Face outline
  ctx.strokeStyle = isFake ? 'rgba(255,64,96,0.4)' : 'rgba(57,255,138,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(150, 120, 70, 85, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes
  ctx.strokeStyle = isFake ? '#ff4060' : '#39ff8a';
  ctx.lineWidth = 1.5;
  [[115, 95], [185, 95]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.ellipse(x, y, 18, 10, 0, 0, Math.PI * 2); ctx.stroke();
  });

  // Pupils
  ctx.fillStyle = isFake ? 'rgba(255,64,96,0.5)' : 'rgba(57,255,138,0.5)';
  [[115, 95], [185, 95]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  });

  // Nose bridge
  ctx.strokeStyle = isFake ? 'rgba(255,64,96,0.3)' : 'rgba(57,255,138,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(150, 105); ctx.lineTo(150, 135); ctx.stroke();

  // Mouth
  ctx.beginPath(); ctx.arc(150, 145, 20, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();

  // Artefact lines (fake only)
  if (isFake) {
    ctx.strokeStyle = 'rgba(255,64,96,0.18)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      const x = 80 + Math.random() * 100;
      const y = 60 + Math.random() * 130;
      ctx.rect(x, y, 20 + Math.random() * 30, 1.5);
      ctx.stroke();
    }
  }

  // Label
  ctx.fillStyle = '#4a6080';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(isFake ? 'SAMPLE: SYNTHETIC FACE' : 'SAMPLE: AUTHENTIC PORTRAIT', 150, 228);
}

function runDemo(type) {
  state.demoMode = type;
  setFileReady();
  drawDemoFace(type);
  showCanvasPreview();
}

dom.btnReal.addEventListener('click', () => runDemo('real'));
dom.btnFake.addEventListener('click', () => runDemo('fake'));

/* ── Analysis pipeline ──────────────────────────────────────── */
const ANALYSIS_STEPS = [
  'INITIALIZING NEURAL PIPELINE...',
  'LOADING FACIAL LANDMARK MODEL...',
  'DETECTING FACE REGIONS...',
  'RUNNING GAN ARTIFACT DETECTION...',
  'ANALYZING FREQUENCY DOMAIN...',
  'CHECKING TEMPORAL CONSISTENCY...',
  'CROSS-REFERENCING METADATA...',
  'COMPUTING CONFIDENCE SCORES...',
];

const PROGRESS_MILESTONES = [5, 15, 30, 48, 62, 75, 88, 100];

dom.analyzeBtn.addEventListener('click', startAnalysis);

function startAnalysis() {
  dom.analyzeBtn.style.display = 'none';
  dom.resultsSection.style.display = 'none';
  dom.loadingState.style.display   = 'block';
  dom.scanOverlay.style.display    = 'block';
  dom.loadingFill.style.width = '0%';

  let step = 0;
  const interval = setInterval(() => {
    if (step < ANALYSIS_STEPS.length) {
      dom.loadingText.textContent = ANALYSIS_STEPS[step];
      dom.loadingFill.style.width = PROGRESS_MILESTONES[step] + '%';
      step++;
    }
  }, 320);

  setTimeout(() => {
    clearInterval(interval);
    dom.loadingFill.style.width = '100%';
    setTimeout(() => {
      dom.loadingState.style.display = 'none';
      showResults();
    }, 300);
  }, 2900);
}

/* ── Results rendering ──────────────────────────────────────── */
function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

function showResults() {
  const isFake = state.demoMode === 'fake' ? true
               : state.demoMode === 'real' ? false
               : Math.random() > 0.45;

  const confidence = isFake ? rand(87, 97) : rand(90, 99);

  dom.resultsSection.style.display = 'block';

  renderLog(isFake, confidence);
  renderVerdict(isFake, confidence);
  renderMetrics(isFake, confidence);
  renderFreqChart(isFake);
  renderAnomalyMap(isFake);
}

/* Log */
function renderLog(isFake, confidence) {
  const logs = isFake ? [
    { type: 'ok',    msg: 'Face region detected — 1 primary face identified' },
    { type: 'warn',  msg: 'GAN fingerprint detected in high-frequency spectrum' },
    { type: 'alert', msg: 'Eye region blending artifacts — inconsistency score: HIGH' },
    { type: 'alert', msg: 'Facial landmark geometry deviation: 34 anomalies flagged' },
    { type: 'warn',  msg: 'EXIF metadata missing — possible re-encoding detected' },
    { type: 'alert', msg: 'DCT coefficient anomaly in 3 facial zones' },
    { type: 'alert', msg: `VERDICT: DEEPFAKE DETECTED — confidence ${confidence}%` },
  ] : [
    { type: 'ok', msg: 'Face region detected — 1 primary face identified' },
    { type: 'ok', msg: 'No GAN fingerprint detected in frequency domain' },
    { type: 'ok', msg: 'Facial landmark geometry within expected range' },
    { type: 'ok', msg: 'EXIF metadata present and consistent' },
    { type: 'ok', msg: 'Compression artifacts match natural camera noise' },
    { type: 'ok', msg: 'Skin texture analysis: natural micro-texture detected' },
    { type: 'ok', msg: `VERDICT: AUTHENTIC — confidence ${confidence}%` },
  ];

  dom.logPanel.innerHTML = '';
  const base = new Date();

  logs.forEach((entry, i) => {
    setTimeout(() => {
      const t = new Date(base.getTime() + i * 120);
      const pad = v => String(v).padStart(2, '0');
      const ms  = String(i * 120).padStart(3, '0');
      const timeStr = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}.${ms}`;

      const el = document.createElement('div');
      el.className = `log-entry ${entry.type}`;
      el.innerHTML = `<span class="log-time">${timeStr}</span><span class="log-msg">${entry.msg}</span>`;
      dom.logPanel.appendChild(el);
      dom.logPanel.scrollTop = dom.logPanel.scrollHeight;
    }, i * 150);
  });
}

/* Verdict */
function renderVerdict(isFake, confidence) {
  dom.verdictCard.className = `verdict-card ${isFake ? 'fake' : 'real'}`;
  dom.verdictIcon.textContent  = isFake ? '⚠' : '✓';
  dom.verdictLabel.textContent = isFake ? 'DEEPFAKE' : 'AUTHENTIC';
  dom.verdictDesc.textContent  = isFake
    ? 'This media has been identified as synthetically manipulated. Multiple AI-generated artifacts detected across facial regions. GAN fingerprinting confirms synthetic origin.'
    : 'This media appears to be authentic. No significant manipulation artifacts detected. Facial geometry, frequency domain, and metadata are all consistent with genuine capture.';

  // Animate confidence counter
  let current = 0;
  const tick = setInterval(() => {
    current = Math.min(current + 3, confidence);
    dom.confNum.textContent = current;
    if (current >= confidence) clearInterval(tick);
  }, 18);
}

/* Metrics */
function renderMetrics(isFake, confidence) {
  const metrics = isFake ? [
    { name: 'GAN FINGERPRINT',    val: confidence - 3,      level: 'danger'  },
    { name: 'BLEND ARTIFACTS',    val: rand(70, 85),        level: 'danger'  },
    { name: 'LANDMARK DEVIATION', val: rand(62, 76),        level: 'warning' },
    { name: 'METADATA INTEGRITY', val: rand(12, 26),        level: 'safe'    },
  ] : [
    { name: 'GAN FINGERPRINT',    val: rand(2, 10),         level: 'safe'    },
    { name: 'BLEND ARTIFACTS',    val: rand(5, 16),         level: 'safe'    },
    { name: 'LANDMARK DEVIATION', val: rand(8, 20),         level: 'info'    },
    { name: 'METADATA INTEGRITY', val: rand(92, 99),        level: 'safe'    },
  ];

  dom.metricsGrid.innerHTML = '';

  metrics.forEach(m => {
    const card = document.createElement('div');
    card.className = `metric-card ${m.level}`;
    card.innerHTML = `
      <div class="metric-name">${m.name}</div>
      <div class="metric-bar-track">
        <div class="metric-bar-fill" data-val="${m.val}"></div>
      </div>
      <div class="metric-val">${m.val}%</div>
    `;
    dom.metricsGrid.appendChild(card);
  });

  // Trigger bar animations after paint
  requestAnimationFrame(() => {
    dom.metricsGrid.querySelectorAll('.metric-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.val + '%';
    });
  });
}

/* Frequency chart */
function renderFreqChart(isFake) {
  dom.freqChart.innerHTML = '';
  const BANDS = 32;

  for (let i = 0; i < BANDS; i++) {
    const div = document.createElement('div');
    div.className = 'freq-bar';

    const height = isFake
      ? (i < 10 ? rand(18, 45) : i > 22 ? rand(55, 90) : rand(28, 55))
      : Math.round(20 + 50 * Math.abs(Math.sin(i / BANDS * Math.PI)) * (0.7 + Math.random() * 0.6));

    div.style.background = isFake ? (i > 20 ? '#ff4060' : '#ffb830') : '#39ff8a';
    div.style.opacity = '0.75';
    div.dataset.h = Math.min(height, 100);
    dom.freqChart.appendChild(div);
  }

  // Animate after a short delay
  setTimeout(() => {
    dom.freqChart.querySelectorAll('.freq-bar').forEach(bar => {
      bar.style.height = bar.dataset.h + '%';
    });
  }, 200);
}

/* Facial anomaly map */
function renderAnomalyMap(isFake) {
  dom.anomalyDots.innerHTML = '';

  const zones = isFake
    ? [
        { x: 72,  y: 85  },
        { x: 128, y: 85  },
        { x: 90,  y: 78  },
        { x: 115, y: 82  },
        { x: 100, y: 115 },
        { x: 82,  y: 135 },
        { x: 118, y: 130 },
        { x: 60,  y: 105 },
        { x: 140, y: 108 },
      ]
    : [
        { x: 100, y: 160 },
        { x: 100, y: 50  },
      ];

  const color  = isFake ? '#ff4060' : '#39ff8a';
  const fillAl = isFake ? '0.35'     : '0.3';
  const radius = isFake ? 6          : 4;

  zones.forEach((z, i) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', z.x);
    circle.setAttribute('cy', z.y);
    circle.setAttribute('r',  radius);
    circle.setAttribute('fill',         `rgba(${hexToRgb(color)},${fillAl})`);
    circle.setAttribute('stroke',       color);
    circle.setAttribute('stroke-width', '1');
    circle.style.opacity    = '0';
    circle.style.transition = `opacity 0.3s ${i * 0.08}s`;
    dom.anomalyDots.appendChild(circle);

    // Trigger fade-in
    requestAnimationFrame(() => { circle.style.opacity = '1'; });
  });
}

/** Convert 6-char hex (#rrggbb) to "r,g,b" string */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/* ── Reset ──────────────────────────────────────────────────── */
dom.resetBtn.addEventListener('click', resetAll);

function resetAll() {
  state.demoMode = null;
  state.hasFile  = false;

  dom.analyzeBtn.style.display    = 'block';
  dom.analyzeBtn.disabled         = true;
  dom.resultsSection.style.display = 'none';
  dom.loadingState.style.display  = 'none';
  dom.scanOverlay.style.display   = 'none';
  dom.previewCanvas.style.display = 'none';
  dom.previewHolder.style.display = 'flex';
  dom.anomalyDots.innerHTML = '';
  dom.fileInput.value = '';
}