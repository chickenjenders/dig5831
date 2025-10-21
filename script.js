/* ---------- Tiny watermark tiling ---------- */
(function renderWatermark() {
  const wm = document.getElementById('watermark');
  const cols = Math.ceil(window.innerWidth / 240);
  const rows = Math.ceil(window.innerHeight / 120);
  const total = cols * rows;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const s = document.createElement('span');
    s.textContent = "PERPETUA SYSTEMS";
    fragment.appendChild(s);
  }
  wm.appendChild(fragment);
})();

/* ---------- Game state (kept consistent with your prior logic) ---------- */
let gameState = {
  currentShift: 1,
  currentSoulId: null,
  souls: [],
  processedSouls: 0,
  correctAssignments: 0,
  formData: {},
  emailUnread: true
};

/* ---------- Sample soul DB (shift1) ---------- */
const soulDatabase = {
  shift1: [
    {
      id: 'S1-001', name: 'Marcus Blackwell', correctDepartment: 'CA',
      description: `<span class="draggable" data-type="name" data-value="Marcus Blackwell">Marcus Blackwell</span> arrived on <span class="draggable" data-type="dateOfDeath" data-value="March 15, 2024">March 15, 2024</span> after <span class="draggable" data-type="causeOfDeath" data-value="heart attack during hostile takeover meeting">heart attack during a hostile takeover meeting</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="insider trading, fraud">insider trading, fraud</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="financial manipulation and market corruption">financial manipulation</span>. Traits: <span class="draggable" data-type="traits" data-value="ruthless ambition">ruthless ambition</span>. Skills: <span class="draggable" data-type="skills" data-value="contract negotiation">contract negotiation</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
    {
      id: 'S1-002', name: 'Jennifer Wu', correctDepartment: 'DR',
      description: `Case: <span class="draggable" data-type="name" data-value="Jennifer Wu">Jennifer Wu</span>, <span class="draggable" data-type="dateOfDeath" data-value="July 22, 2024">July 22, 2024</span>, <span class="draggable" data-type="causeOfDeath" data-value="overdose of prescription medications">intentional overdose</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="emotional manipulation, blackmail">emotional manipulation</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="psychological abuse">psychological abuse</span>. Traits: <span class="draggable" data-type="traits" data-value="socially manipulative">socially manipulative</span>. Skills: <span class="draggable" data-type="skills" data-value="conflict mediation">conflict mediation</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
    {
      id: 'S1-003', name: 'Viktor Petrov', correctDepartment: 'OC',
      description: `Intake: <span class="draggable" data-type="name" data-value="Viktor Petrov">Viktor Petrov</span>, <span class="draggable" data-type="dateOfDeath" data-value="November 3, 2023">November 3, 2023</span>, <span class="draggable" data-type="causeOfDeath" data-value="execution by firing squad">execution by firing squad</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="war crimes, torture">war crimes</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="abuse of authority">abuse of authority</span>. Traits: <span class="draggable" data-type="traits" data-value="authoritarian">authoritarian</span>. Skills: <span class="draggable" data-type="skills" data-value="enforcement">enforcement</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
    {
      id: 'S1-004', name: 'Dr. Sarah Chen', correctDepartment: 'AD',
      description: `<span class="draggable" data-type="name" data-value="Dr. Sarah Chen">Dr. Sarah Chen</span>, <span class="draggable" data-type="dateOfDeath" data-value="January 8, 2025">January 8, 2025</span>, <span class="draggable" data-type="causeOfDeath" data-value="laboratory accident">laboratory accident</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="illegal human experimentation">illegal human experimentation</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="deliberate infliction of psychological trauma">deliberate psychological torture</span>. Traits: <span class="draggable" data-type="traits" data-value="creative sadism">creative sadism</span>. Skills: <span class="draggable" data-type="skills" data-value="experimental design">experimental design</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
    {
      id: 'S1-005', name: 'Robert Kane', correctDepartment: 'MA',
      description: `<span class="draggable" data-type="name" data-value="Robert Kane">Robert Kane</span>, <span class="draggable" data-type="dateOfDeath" data-value="September 30, 2024">September 30, 2024</span>, <span class="draggable" data-type="causeOfDeath" data-value="assassination">assassination</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="cult leadership, extortion">cult leadership</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="mass manipulation">mass manipulation</span>. Traits: <span class="draggable" data-type="traits" data-value="charismatic">charismatic</span>. Skills: <span class="draggable" data-type="skills" data-value="mass persuasion">mass persuasion</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
    {
      id: 'S1-006', name: 'Linda Martinez', correctDepartment: 'DR',
      description: `<span class="draggable" data-type="name" data-value="Linda Martinez">Linda Martinez</span>, <span class="draggable" data-type="dateOfDeath" data-value="December 12, 2024">December 12, 2024</span>, <span class="draggable" data-type="causeOfDeath" data-value="car accident">car accident</span>. Records: <span class="draggable" data-type="criminalRecord" data-value="exploitation of patients">exploitation of patients</span>. Judgment: <span class="draggable" data-type="sentenceJustification" data-value="betrayal of trust">betrayal of trust</span>. Traits: <span class="draggable" data-type="traits" data-value="false empathy">false empathy</span>. Skills: <span class="draggable" data-type="skills" data-value="counseling">counseling</span>.`,
      requiredFields: ['name', 'dateOfDeath', 'causeOfDeath', 'criminalRecord', 'sentenceJustification', 'traits', 'skills']
    },
  ]
};

/* ---------- Initialization ---------- */
function initGame() {
  gameState.souls = soulDatabase.shift1.map(s => ({ ...s, status: 'pending', formComplete: false }));
  gameState.processedSouls = 0;
  gameState.correctAssignments = 0;
  gameState.formData = {};
  renderWorklist();
  loadShiftEmail();
  document.getElementById('totalSouls').textContent = gameState.souls.length;
  // start blinking mail icon
  document.getElementById('mailBtn').classList.add('blinking');
}

/* ---------- Render worklist & queue ---------- */
function renderWorklist() {
  const container = document.getElementById('worklistContent');
  container.innerHTML = '';
  gameState.souls.forEach(soul => {
    const div = document.createElement('div');
    div.className = 'worklist-item' + (gameState.currentSoulId === soul.id ? ' selected' : '');
    div.onclick = () => selectSoul(soul.id);
    div.innerHTML = `<div style="flex:1">
            <div class="worklist-id">${soul.id}</div>
            <div class="worklist-name">${soul.name}</div>
        </div>
        <div><span class="status-badge ${soul.status === 'submitted' ? 'status-submitted' : soul.status === 'progress' ? 'status-progress' : 'status-pending'}">${soul.status === 'submitted' ? 'Submitted' : soul.status === 'progress' ? 'In Progress' : 'Pending'}</span></div>`;
    container.appendChild(div);
  });
  updateShiftInfo();
}

/* ---------- Soul selection & rendering ---------- */
function selectSoul(id) {
  gameState.currentSoulId = id;
  const soul = gameState.souls.find(s => s.id === id);
  if (soul.status === 'pending') soul.status = 'progress';
  renderWorklist();
  renderSoulCard(soul);
  clearForm();
}

function renderSoulCard(soul) {
  const viewer = document.getElementById('soulViewerContent');
  viewer.innerHTML = '';

  // Create resume-style container
  const resumeContainer = document.createElement('div');
  resumeContainer.className = 'resume-container';
  resumeContainer.innerHTML = `
    <div class="resume-header">
      <div class="resume-photo">👤</div>
      <div class="resume-title-section">
        <div class="resume-id">${soul.id}</div>
        <h1 class="resume-name">${escapeHtml(soul.name)}</h1>
      </div>
    </div>

    <div class="resume-content">
      <section class="resume-section">
        <h2 class="resume-section-title">CANDIDATE OVERVIEW</h2>
        <div class="resume-divider"></div>
        <div class="overview-grid">
          <div class="overview-item">
            <span class="overview-label">ID:</span>
            <span class="overview-value">${escapeHtml(soul.id)}</span>
          </div>
          <div class="overview-item">
            <span class="overview-label">Status:</span>
            <span class="overview-value">Under Review</span>
          </div>
        </div>
      </section>

      <section class="resume-section">
        <h2 class="resume-section-title">FULL CASE DETAILS</h2>
        <div class="resume-divider"></div>
        <div class="case-details">
          ${soul.description}
        </div>
      </section>
    </div>
  `;

  viewer.appendChild(resumeContainer);

  // initialize draggable text elements
  setTimeout(() => {
    const draggables = viewer.querySelectorAll('.draggable');
    draggables.forEach(d => {
      d.setAttribute('draggable', 'true');
      d.addEventListener('dragstart', handleDragStart);
      d.addEventListener('dragend', handleDragEnd);
    });
  }, 10);
}

/* ---------- Drag & Drop ---------- */
let draggedData = null;
function handleDragStart(e) {
  const target = e.target;
  draggedData = { type: target.dataset.type, value: target.dataset.value };
  target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

function setupDropZones() {
  const zones = document.querySelectorAll('.drop-zone');
  zones.forEach(z => {
    z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('drag-over') });
    z.addEventListener('dragleave', e => { z.classList.remove('drag-over') });
    z.addEventListener('drop', e => {
      e.preventDefault(); z.classList.remove('drag-over');
      if (!draggedData) return;
      const field = z.dataset.field;
      if (!gameState.formData[gameState.currentSoulId]) gameState.formData[gameState.currentSoulId] = {};
      gameState.formData[gameState.currentSoulId][field] = draggedData.value;
      z.classList.add('filled');
      z.innerHTML = `<span class="dropped-item">${escapeHtml(draggedData.value)}<span class="remove-item" onclick="removeDroppedItem('${field}', event)">✕</span></span>`;
    });
  });
}

/* ---------- Remove dropped ---------- */
function removeDroppedItem(field, ev) {
  ev.stopPropagation();
  const zone = document.querySelector(`.drop-zone[data-field="${field}"]`);
  if (zone) {
    zone.classList.remove('filled');
    const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    zone.innerHTML = `Drag and drop ${label} here...`;
  }
  if (gameState.formData[gameState.currentSoulId]) delete gameState.formData[gameState.currentSoulId][field];
}

/* ---------- Form submit / validation ---------- */
function submitForm() {
  if (!gameState.currentSoulId) { showModal('Error', 'Select a soul first.'); return; }
  const soul = gameState.souls.find(s => s.id === gameState.currentSoulId);
  const form = gameState.formData[gameState.currentSoulId] || {};
  const dept = document.getElementById('departmentSelect').value;
  const missing = [];
  soul.requiredFields.forEach(f => { if (!form[f]) missing.push(f); });
  if (!dept) missing.push('department');

  if (missing.length) {
    const field = missing[0].replace(/([A-Z])/g, ' $1').toLowerCase();
    showModal('Missing Required Information', `Form 666-B is incomplete. Missing: <strong>${field}</strong>.<br><br>Request this data from DR Services?`, [
      { text: 'Report Missing Info', action: () => { closeModal(); composeEmail(gameState.currentSoulId, field); openEmailWindow(); } },
      { text: 'Cancel', action: closeModal }
    ]);
    return;
  }
  const isCorrect = dept === soul.correctDepartment;
  if (isCorrect) gameState.correctAssignments++;
  soul.status = 'submitted'; soul.formComplete = true;
  gameState.processedSouls++;
  renderWorklist();
  clearForm();
  showModal('Form Submitted', `Soul <strong>${soul.id}</strong> submitted to <strong>${getDepartmentName(dept)}</strong>.`, [{ text: 'OK', action: () => { closeModal(); if (gameState.processedSouls >= gameState.souls.length) showShiftComplete(); else { const next = gameState.souls.find(s => s.status !== 'submitted'); if (next) selectSoul(next.id); } } }]);
}

/* ---------- Utility ---------- */
function getDepartmentName(code) {
  const map = { 'DR': 'Demon Relations', 'MA': 'Mortal Affairs', 'CA': 'Contracts & Acquisitions', 'AD': 'Agony & Despair', 'OC': 'Operations & Compliance' };
  return map[code] || code;
}
function clearForm() {
  document.querySelectorAll('.drop-zone').forEach(z => {
    z.classList.remove('filled');
    const field = z.dataset.field;
    z.innerHTML = `Drag and drop ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} here...`;
  });
  document.getElementById('departmentSelect').value = '';
  if (gameState.currentSoulId) gameState.formData[gameState.currentSoulId] = {};
}

/* ---------- Email system (simple) ---------- */
function loadShiftEmail() {
  const list = document.getElementById('emailList');
  list.innerHTML = '';

  const first = document.createElement('div');
  first.className = 'email-item unread';
  first.id = 'email-shift1';
  first.innerHTML = `
    <div class="email-sender">Malphas</div>
    <div class="email-subject">SHIFT 1 - Orientation Protocol</div>
    <div class="email-preview">Welcome to Demon Relations Processing...</div>
  `;
  first.onclick = () => openEmail('shift1', first);
  list.appendChild(first);

  const spam = document.createElement('div');
  spam.className = 'email-item';
  spam.id = 'email-cecil1';
  spam.innerHTML = `
    <div class="email-sender">Cecil (Floor 3)</div>
    <div class="email-subject">Reminder: Do not take the last donut</div>
    <div class="email-preview">Just a small note...</div>
  `;
  spam.onclick = () => openEmail('cecil1', spam);
  list.appendChild(spam);
}

function openEmail(id, emailElement) {
  // Update selected state
  document.querySelectorAll('.outlook-email-list .email-item').forEach(el => {
    el.classList.remove('selected');
  });
  if (emailElement) emailElement.classList.add('selected');

  // stop blinking when open initial
  document.getElementById('mailBtn').classList.remove('blinking');

  const view = document.getElementById('emailView');
  view.innerHTML = ''; // populate
  if (id === 'shift1') {
    view.innerHTML = `
      <div class="outlook-email-header">
        <div class="email-from">
          <div class="email-from-avatar">M</div>
          <div class="email-from-info">
            <div class="email-from-name">Malphas (Director, Demon Relations)</div>
            <div class="email-from-address">malphas@perpetua.hel</div>
          </div>
        </div>
        <div class="email-date">Today, 08:00 AM</div>
        <div class="email-subject-line">SHIFT 1 - Orientation Protocol</div>
      </div>
      <div class="outlook-email-body">
        <p>Welcome to Demon Relations Processing.</p>
        <ol>
          <li>Review each soul case file in your queue.</li>
          <li>Populate Form 666-B by dragging required info from the case file.</li>
          <li>Select the appropriate department for review.</li>
          <li>Submit completed forms before the shift ends. Quota: <strong>6</strong> souls.</li>
        </ol>
        <div class="outlook-email-importance">
          <strong>Important:</strong> All fields marked * are required. Missing info will delay processing.
        </div>
        <p><em>— Malphas</em></p>
      </div>
    `;
  } else {
    view.innerHTML = `
      <div class="outlook-email-header">
        <div class="email-from">
          <div class="email-from-avatar">C</div>
          <div class="email-from-info">
            <div class="email-from-name">Cecil (Floor 3)</div>
            <div class="email-from-address">cecil@perpetua.hel</div>
          </div>
        </div>
        <div class="email-date">Today, 09:30 AM</div>
        <div class="email-subject-line">Reminder: Do not take the last donut</div>
      </div>
      <div class="outlook-email-body">
        <p>Please, there is enough for us to each have one! That means ONE PER PERSON OR I WILL FIND YOU.</p>
      </div>
    `;
  }
}

function openEmailWindow() {
  const emailWindow = document.getElementById('emailWindow');
  emailWindow.style.display = 'block';
  emailWindow.style.zIndex = '5000';
  document.getElementById('mailBtn').classList.remove('blinking');
}
function closeEmailWindow() { closeWindow('emailWindow'); }

/* ---------- Compose / Report (auto-draft flow) ---------- */
function composeEmail(soulId, missingField) {
  openEmailWindow();
  const view = document.getElementById('emailView');
  view.innerHTML = `<div style="font-weight:700;margin-bottom:8px">To: DR-Services@perpetua.hel</div>
    <div style="font-weight:700">Subject: Request for Clarification - ${soulId}</div>
    <div style="margin-top:12px;color:#4b433f">Requesting missing information for processing Soul ${soulId}. Missing: <strong>${missingField}</strong>.<br><br>Please provide updated data so Form 666-B can be completed.<br><br>— Processing Division</div>
    <div style="margin-top:18px"><button class="btn" onclick="sendEmail()">Send Request</button> <button class="btn btn-secondary" onclick="closeEmailWindow()">Cancel</button></div>`;
  // ensure mail is visible as read action later
}

function sendEmail() {
  closeEmailWindow();
  showModal('Request Sent', 'Your request has been submitted to DR Services. Response incoming…', [{ text: 'OK', action: () => { closeModal(); setTimeout(receiveEmailResponse, 1600); } }]);
}

/* ---------- Simulated DR Services response ---------- */
function receiveEmailResponse() {
  const soul = gameState.souls.find(s => s.id === gameState.currentSoulId);
  if (soul) {
    // for shift1 we simply mark as progress (this will be used later for corrupted/missing data)
    soul.status = 'progress';
    renderWorklist();
  }
  showModal('New Email', 'DR Services has responded. Missing information added to case file.', [{ text: 'View Case File', action: () => { closeModal(); } }]);
}

/* ---------- Shift complete ---------- */
function showShiftComplete() {
  const accuracy = Math.round((gameState.correctAssignments / gameState.processedSouls) * 100) || 0;
  const ok = accuracy >= 80;
  const html = `<p><strong>Souls Processed:</strong> ${gameState.processedSouls}/${gameState.souls.length}</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p style="margin-top:12px;padding:12px;border-radius:6px;background:${ok ? '#e8f6ea' : '#fdecea'};color:${ok ? '#155724' : '#7a2b2b'}">${ok ? '✓ PERFORMANCE: ACCEPTABLE' : '✗ PERFORMANCE: NEEDS IMPROVEMENT'}</p>
    <p style="font-size:12px;color:#6b6058;margin-top:10px">Shift 2 (with corrupted/missing data) will expand these systems.</p>`;
  showModal('SHIFT 1 COMPLETE', html, [{ text: 'End Shift', action: () => { closeModal(); resetForNewShift(); } }]);
}

/* ---------- Modal helpers ---------- */
function showModal(title, body, actions = [{ text: 'OK', action: closeModal }]) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = typeof body === 'string' ? body : '';
  const ok = document.getElementById('modalOk');
  ok.onclick = actions.length ? actions[0].action : closeModal;
  modal.style.display = 'block';
  modal.style.zIndex = 5000;
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

/* ---------- Helpers / UI toggles ---------- */
function openFormPanel() {
  const el = document.getElementById('formWindow');
  el.style.display = 'block';
  el.classList.remove('minimized');
  bringToFront(el);
}

function toggleFormPanel() {
  const el = document.getElementById('formWindow');
  const willOpen = (el.style.display === 'none' || !el.style.display);
  el.style.display = willOpen ? 'block' : 'none';
  if (willOpen) {
    el.classList.remove('minimized');
    bringToFront(el);
  }
}
function focusMain() {
  const main = document.getElementById('main-app');
  if (main.style.display === 'none') main.style.display = 'flex';
  bringToFront(main);
  window.scrollTo(0, 0);
}
function toggleEmailWindow() {
  const el = document.getElementById('emailWindow');
  console.log('toggleEmailWindow called, current display:', el.style.display);
  if (el.style.display === 'none' || !el.style.display) {
    console.log('Opening email window');
    openEmailWindow();
  } else {
    console.log('Closing email window');
    closeEmailWindow();
  }
}/* ---------- Small util ---------- */
function updateShiftInfo() {
  document.getElementById('soulsProcessed').textContent = gameState.processedSouls;
  document.getElementById('totalSouls').textContent = gameState.souls.length;
  document.getElementById('accuracy').textContent = gameState.processedSouls ? Math.round((gameState.correctAssignments / gameState.processedSouls) * 100) + '%' : '-';
}
function resetForNewShift() {
  initGame();
  document.getElementById('soulViewerContent').innerHTML = `<div style="font-size:48px;opacity:0.6">📄</div><p style="color:#6b6058;margin-top:12px">Select a soul from the queue to view case file</p>`;
}

/* ---------- safe HTML escape for inserted values ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; });
}

/* ---------- Window management (drag, resize, min/max/close) ---------- */
const TASKBAR_HEIGHT = 72;

let zIndexCounter = 5001;

let windowState = {
  activeWindow: null,
  dragging: null,
  resizing: null,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  startLeft: 0,
  startTop: 0,
  lastMouseX: 0,
  lastMouseY: 0,
  rafId: null
};

function bringToFront(el) {
  zIndexCounter += 1;
  el.style.zIndex = zIndexCounter;
}

function storePrevRect(el) {
  const r = el.getBoundingClientRect();
  el.dataset.prevLeft = r.left;
  el.dataset.prevTop = r.top;
  el.dataset.prevWidth = r.width;
  el.dataset.prevHeight = r.height;
}

function restorePrevRect(el) {
  if (el.dataset.prevWidth) {
    el.style.left = Math.max(0, parseFloat(el.dataset.prevLeft)) + 'px';
    el.style.top = Math.max(0, parseFloat(el.dataset.prevTop)) + 'px';
    el.style.width = parseFloat(el.dataset.prevWidth) + 'px';
    el.style.height = parseFloat(el.dataset.prevHeight) + 'px';
  }
}

function makeWindowDraggable(windowId, handleId = null) {
  const windowEl = document.getElementById(windowId);
  const handle = handleId ? document.getElementById(handleId) : windowEl.querySelector('.window-titlebar');
  if (!handle) return;

  handle.addEventListener('dblclick', (e) => {
    if (e.target.closest('.window-btn')) return;
    maximizeWindow(windowId);
  });

  handle.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;
    bringToFront(windowEl);

    windowState.dragging = windowId;
    windowState.startX = e.clientX;
    windowState.startY = e.clientY;
    const r = windowEl.getBoundingClientRect();
    windowState.startLeft = r.left;
    windowState.startTop = r.top;

    // If maximized, restore to previous rect before dragging
    if (windowEl.classList.contains('maximized')) {
      windowEl.classList.remove('maximized');
      restorePrevRect(windowEl);
      const newR = windowEl.getBoundingClientRect();
      windowState.startLeft = newR.left;
      windowState.startTop = newR.top;
    }

    // lock explicit size to current
    windowEl.style.position = 'fixed';
    windowEl.style.width = r.width + 'px';
    windowEl.style.height = r.height + 'px';
    windowEl.style.left = r.left + 'px';
    windowEl.style.top = r.top + 'px';

    e.preventDefault();
  });

  // Focus window on any mousedown
  windowEl.addEventListener('mousedown', () => bringToFront(windowEl));
}

function startResize(e, windowId) {
  e.preventDefault();
  e.stopPropagation();
  const windowEl = document.getElementById(windowId);
  bringToFront(windowEl);

  // exit maximized before resizing
  if (windowEl.classList.contains('maximized')) {
    windowEl.classList.remove('maximized');
    restorePrevRect(windowEl);
  }

  const r = windowEl.getBoundingClientRect();
  windowState.resizing = windowId;
  windowState.startX = e.clientX;
  windowState.startY = e.clientY;
  windowState.startWidth = r.width;
  windowState.startHeight = r.height;
  windowState.startLeft = r.left;
  windowState.startTop = r.top;

  windowEl.style.position = 'fixed';
  windowEl.style.width = r.width + 'px';
  windowEl.style.height = r.height + 'px';
  windowEl.style.left = r.left + 'px';
  windowEl.style.top = r.top + 'px';
}

function clampToViewport(left, top, el) {
  const r = el.getBoundingClientRect();
  const maxLeft = window.innerWidth - r.width - 8;
  const maxTop = window.innerHeight - TASKBAR_HEIGHT - r.height - 8;
  return {
    left: Math.min(Math.max(left, 8), Math.max(8, maxLeft)),
    top: Math.min(Math.max(top, 8), Math.max(8, maxTop))
  };
}

function minimizeWindow(windowId) {
  const windowEl = document.getElementById(windowId);
  windowEl.classList.toggle('minimized');
}

function maximizeWindow(windowId) {
  const windowEl = document.getElementById(windowId);
  const isMax = windowEl.classList.contains('maximized');
  if (!isMax) storePrevRect(windowEl);
  windowEl.classList.toggle('maximized');
  if (!windowEl.classList.contains('maximized')) {
    // restore previous size/position
    restorePrevRect(windowEl);
  }
}

function closeWindow(windowId) {
  const windowEl = document.getElementById(windowId);
  windowEl.style.display = 'none';
}

function closeMainApp() {
  document.getElementById('main-app').style.display = 'none';
}

function closeEmailWindow() { closeWindow('emailWindow'); }

// Smooth mouse handling with rAF to reduce jitter
function onMouseMove(e) {
  windowState.lastMouseX = e.clientX;
  windowState.lastMouseY = e.clientY;

  if (!windowState.rafId) {
    windowState.rafId = requestAnimationFrame(() => {
      windowState.rafId = null;
      if (windowState.dragging) {
        const el = document.getElementById(windowState.dragging);
        const dx = windowState.lastMouseX - windowState.startX;
        const dy = windowState.lastMouseY - windowState.startY;
        let left = windowState.startLeft + dx;
        let top = windowState.startTop + dy;
        // clamp inside viewport
        const clamped = clampToViewport(left, top, el);
        el.style.left = clamped.left + 'px';
        el.style.top = clamped.top + 'px';
      }

      if (windowState.resizing) {
        const el = document.getElementById(windowState.resizing);
        const dx = windowState.lastMouseX - windowState.startX;
        const dy = windowState.lastMouseY - windowState.startY;
        const minW = 360; // wider min to reduce jitter
        const minH = 200;
        el.style.width = Math.max(minW, windowState.startWidth + dx) + 'px';
        el.style.height = Math.max(minH, windowState.startHeight + dy) + 'px';
      }
    });
  }
}

function onMouseUp() {
  // end all interactions
  windowState.dragging = null;
  windowState.resizing = null;
}

document.addEventListener('mousemove', onMouseMove, { passive: true });
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setupDropZones();

  // Make floating windows draggable and resizable
  makeWindowDraggable('emailWindow');
  makeWindowDraggable('formWindow');
  makeWindowDraggable('modal');
  makeWindowDraggable('main-app');
  makeWindowDraggable('manualWindow');

  // open email at start after a beat (simulate blinking)
  setTimeout(() => {
    // show a small prompt for unread mail when page loads (mail icon blinks until opened)
    // nothing else — mail open will remove blinking
  }, 400);

  // Manual toolbar wiring
  const prev = document.getElementById('manualPrevBtn');
  const next = document.getElementById('manualNextBtn');
  const zin = document.getElementById('manualZoomIn');
  const zout = document.getElementById('manualZoomOut');
  const pageInput = document.getElementById('manualPageInput');
  const printBtn = document.getElementById('manualPrintBtn');
  if (prev) prev.addEventListener('click', manualPrevPage);
  if (next) next.addEventListener('click', manualNextPage);
  if (zin) zin.addEventListener('click', () => setManualZoom(manualState.zoom + 0.1));
  if (zout) zout.addEventListener('click', () => setManualZoom(manualState.zoom - 0.1));
  if (pageInput) pageInput.addEventListener('change', () => gotoManualPage(parseInt(pageInput.value || '1', 10)));
  if (printBtn) printBtn.addEventListener('click', () => window.print());
});

/* ---------- Manual (PDF-like) Viewer ---------- */
let manualState = {
  pages: [],
  currentPage: 1,
  zoom: 1.0
};

function buildManualPages() {
  const pages = [];
  // Cover page
  pages.push({
    title: 'Business Process Manual',
    html: `
      <h1>Perpetua Systems — Business Process Manual</h1>
      <p style="margin-top:16px">This manual describes intake, evaluation, and departmental assignment protocols for soul processing. Refer to this during your shift for policy and department responsibilities.</p>
      <h2 style="margin-top:28px">Contents</h2>
      <ol style="margin-left:18px">
        <li>Demon Relations (DR)</li>
        <li>Mortal Affairs (MA)</li>
        <li>Contracts &amp; Acquisitions (C&amp;A)</li>
        <li>Agony &amp; Despair (A&amp;D)</li>
        <li>Operations &amp; Compliance (O&amp;C)</li>
      </ol>
      <p style="position:absolute;bottom:56px;color:#777;font-size:12px">Document Class: Internal — Rev. 666.1</p>
    `
  });

  // Department pages
  pages.push({
    title: 'Demon Relations (DR)',
    html: `
      <h1>Demon Relations (DR)</h1>
      <p>Manages inter-demon diplomacy, dispute mediation, and morale programs. Suitable candidates excel at manipulation with a veneer of charm.</p>
      <h2>Candidate Profile</h2>
      <ul>
        <li>Traits: socially manipulative, charismatic, persuasive.</li>
        <li>Background: influence operations, counseling-as-control, soft-power abuse.</li>
      </ul>
      <h2>Key Duties</h2>
      <ul>
        <li>Conflict mediation across circles.</li>
        <li>Messaging alignment with Directorate decrees.</li>
        <li>Rumor shaping and perception audits.</li>
      </ul>
      <h2>Red Flags</h2>
      <ul>
        <li>Aversion to collaboration.</li>
        <li>Overt brutality (redirect to A&amp;D or O&amp;C).</li>
      </ul>
    `
  });

  pages.push({
    title: 'Mortal Affairs (MA)',
    html: `
      <h1>Mortal Affairs (MA)</h1>
      <p>Oversees ongoing mortal-world influences and posthumous entanglements. Ideal for mass persuasion experts and cult logistics personnel.</p>
      <h2>Candidate Profile</h2>
      <ul>
        <li>Traits: charismatic, crowd dynamics savvy.</li>
        <li>Background: propaganda, cult leadership, large-scale manipulation.</li>
      </ul>
      <h2>Key Duties</h2>
      <ul>
        <li>Shaping mortal narratives to meet quarterly perdition OKRs.</li>
        <li>Coordinating influence cells and proxy organizations.</li>
      </ul>
      <h2>Red Flags</h2>
      <ul>
        <li>Limited scope to one-on-one manipulation only (consider DR).</li>
      </ul>
    `
  });

  pages.push({
    title: 'Contracts & Acquisitions (C&A)',
    html: `
      <h1>Contracts &amp; Acquisitions (C&amp;A)</h1>
      <p>Handles pacts, soul instruments, and asset seizures. Prior experience with fine print weaponization preferred.</p>
      <h2>Candidate Profile</h2>
      <ul>
        <li>Traits: ruthless ambition, detail obsession.</li>
        <li>Background: fraud, insider trading, predatory dealmaking.</li>
      </ul>
      <h2>Key Duties</h2>
      <ul>
        <li>Drafting binding infernal instruments.</li>
        <li>Closing high-risk multi-partite pacts.</li>
        <li>Collateral adjudication and collections.</li>
      </ul>
      <h2>Red Flags</h2>
      <ul>
        <li>Inability to navigate ambiguity at scale.</li>
      </ul>
    `
  });

  pages.push({
    title: 'Agony & Despair (A&D)',
    html: `
      <h1>Agony &amp; Despair (A&amp;D)</h1>
      <p>Designs and operates psychological and physical torment programs. Creativity and ethics-agnostic experimentation are prized.</p>
      <h2>Candidate Profile</h2>
      <ul>
        <li>Traits: creative sadism, methodical curiosity.</li>
        <li>Background: unethical experiments, trauma infliction.</li>
      </ul>
      <h2>Key Duties</h2>
      <ul>
        <li>Designing bespoke torment regimens.</li>
        <li>Running iterative trials with rigorous documentation.</li>
      </ul>
      <h2>Red Flags</h2>
      <ul>
        <li>Compassion fatigue impacting output (consider O&amp;C supervision).</li>
      </ul>
    `
  });

  pages.push({
    title: 'Operations & Compliance (O&C)',
    html: `
      <h1>Operations &amp; Compliance (O&amp;C)</h1>
      <p>Ensures adherence to infernal statutes, process discipline, and throughput quotas across divisions.</p>
      <h2>Candidate Profile</h2>
      <ul>
        <li>Traits: authoritarian, meticulous, enforcement-oriented.</li>
        <li>Background: punitive bureaucracy, war crimes, rules as weapons.</li>
      </ul>
      <h2>Key Duties</h2>
      <ul>
        <li>Auditing procedures and enforcing compliance.</li>
        <li>Maintaining chain-of-torment integrity.</li>
      </ul>
      <h2>Red Flags</h2>
      <ul>
        <li>Grandstanding that disrupts throughput (consider C&amp;A).</li>
      </ul>
    `
  });

  return pages;
}

function ensureManualBuilt() {
  if (!manualState.pages.length) {
    manualState.pages = buildManualPages();
  }
}

function renderManual() {
  ensureManualBuilt();
  const pagesWrap = document.getElementById('manualPages');
  const outline = document.getElementById('manualOutline');
  const totalPagesEl = document.getElementById('manualTotalPages');
  const pageInput = document.getElementById('manualPageInput');
  const zoomDisplay = document.getElementById('manualZoomDisplay');
  if (!pagesWrap) return;

  // Render pages once
  if (!pagesWrap.dataset.rendered) {
    pagesWrap.innerHTML = '';
    manualState.pages.forEach((pg, idx) => {
      const d = document.createElement('div');
      d.className = 'manual-page';
      d.dataset.page = String(idx + 1);
      d.innerHTML = pg.html;
      pagesWrap.appendChild(d);
    });
    pagesWrap.dataset.rendered = '1';
  }

  // Render outline
  if (outline && !outline.dataset.rendered) {
    outline.innerHTML = '';
    manualState.pages.forEach((pg, idx) => {
      const item = document.createElement('div');
      item.className = 'outline-item' + (idx + 1 === manualState.currentPage ? ' active' : '');
      item.textContent = `${idx + 1}. ${pg.title}`;
      item.addEventListener('click', () => gotoManualPage(idx + 1));
      outline.appendChild(item);
    });
    outline.dataset.rendered = '1';
  } else if (outline) {
    [...outline.children].forEach((c, i) => {
      c.classList.toggle('active', i + 1 === manualState.currentPage);
    });
  }

  // Update page controls
  if (totalPagesEl) totalPagesEl.textContent = String(manualState.pages.length);
  if (pageInput) {
    pageInput.max = String(manualState.pages.length);
    pageInput.value = String(manualState.currentPage);
  }
  if (zoomDisplay) zoomDisplay.textContent = Math.round(manualState.zoom * 100) + '%';

  // Apply zoom and scroll current page into view
  const allPages = pagesWrap.querySelectorAll('.manual-page');
  allPages.forEach(p => {
    p.style.transform = `scale(${manualState.zoom})`;
    p.style.marginBottom = (24 * manualState.zoom) + 'px';
  });
  const current = pagesWrap.querySelector(`.manual-page[data-page="${manualState.currentPage}"]`);
  if (current) current.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setManualZoom(z) {
  const clamped = Math.min(2.0, Math.max(0.6, z));
  manualState.zoom = clamped;
  renderManual();
}

function gotoManualPage(n) {
  const total = manualState.pages.length || 1;
  const page = Math.min(total, Math.max(1, n));
  manualState.currentPage = page;
  renderManual();
}

function manualPrevPage() { gotoManualPage(manualState.currentPage - 1); }
function manualNextPage() { gotoManualPage(manualState.currentPage + 1); }

function openManualWindow() {
  const win = document.getElementById('manualWindow');
  win.style.display = 'block';
  win.classList.remove('minimized');
  bringToFront(win);
  // First render
  renderManual();
}
function closeManualWindow() { closeWindow('manualWindow'); }
function toggleManualWindow() {
  const el = document.getElementById('manualWindow');
  const willOpen = (el.style.display === 'none' || !el.style.display);
  if (willOpen) openManualWindow(); else closeManualWindow();
}

