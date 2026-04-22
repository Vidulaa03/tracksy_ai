// ── State ─────────────────────────────────────────────────────────────────────
let selectedStatus = 'applied';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const authScreen    = document.getElementById('auth-screen');
const mainScreen    = document.getElementById('main-screen');
const saveTokenBtn  = document.getElementById('save-token-btn');
const logoutBtn     = document.getElementById('logout-btn');
const authError     = document.getElementById('auth-error');
const saveBtn       = document.getElementById('save-btn');
const saveError     = document.getElementById('save-error');
const saveSuccess   = document.getElementById('save-success');
const serverDisplay = document.getElementById('server-display');
const openTracksy   = document.getElementById('open-tracksy');
const detectedInfo  = document.getElementById('detected-info');
const statusPills   = document.querySelectorAll('.status-pill');

// ── Init ──────────────────────────────────────────────────────────────────────
chrome.storage.local.get(['tracksyToken', 'tracksyServer'], ({ tracksyToken, tracksyServer }) => {
  if (tracksyToken && tracksyServer) {
    showMainScreen(tracksyServer);
    tryDetectJob();
  } else {
    // pre-fill saved server URL if exists
    if (tracksyServer) document.getElementById('server-url').value = tracksyServer;
  }
});

// ── Status pills ──────────────────────────────────────────────────────────────
statusPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    statusPills.forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    selectedStatus = pill.dataset.status;
  });
});

// ── Connect ───────────────────────────────────────────────────────────────────
saveTokenBtn.addEventListener('click', async () => {
  const token  = document.getElementById('auth-token').value.trim();
  const server = document.getElementById('server-url').value.trim().replace(/\/$/, '');
  if (!token || !server) { showAuthError('Both fields are required'); return; }

  saveTokenBtn.disabled = true;
  saveTokenBtn.textContent = 'Connecting…';

  try {
    const res = await fetch(`${server}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Invalid token or wrong server URL');

    chrome.storage.local.set({ tracksyToken: token, tracksyServer: server }, () => {
      showMainScreen(server);
      tryDetectJob();
    });
  } catch (err) {
    showAuthError(err.message || 'Connection failed');
  } finally {
    saveTokenBtn.disabled = false;
    saveTokenBtn.textContent = 'Connect to Tracksy';
  }
});

// ── Sign out ──────────────────────────────────────────────────────────────────
logoutBtn.addEventListener('click', () => {
  chrome.storage.local.remove(['tracksyToken', 'tracksyServer'], () => {
    mainScreen.style.display  = 'none';
    authScreen.style.display  = 'flex';
    logoutBtn.style.display   = 'none';
    saveSuccess.style.display = 'none';
    saveError.style.display   = 'none';
  });
});

// ── Save application ──────────────────────────────────────────────────────────
saveBtn.addEventListener('click', async () => {
  const company  = document.getElementById('company').value.trim();
  const position = document.getElementById('position').value.trim();
  const notes    = document.getElementById('notes').value.trim();

  if (!company || !position) { showSaveError('Company and Position are required'); return; }

  chrome.storage.local.get(['tracksyToken', 'tracksyServer'], async ({ tracksyToken, tracksyServer }) => {
    if (!tracksyToken || !tracksyServer) { showSaveError('Not connected'); return; }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinning">⟳</span> Saving…';
    saveError.style.display   = 'none';
    saveSuccess.style.display = 'none';

    // get current tab URL as jobDescriptionLink
    let tabUrl = '';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabUrl = tab?.url || '';
    } catch {}

    const payload = {
      companyName:        company,
      position,
      status:             selectedStatus,
      notes,
      appliedDate:        new Date().toISOString(),
      jobDescriptionLink: tabUrl,
    };

    try {
      const res = await fetch(`${tracksyServer}/applications`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tracksyToken}` },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }
      saveSuccess.style.display = 'block';
      document.getElementById('company').value  = '';
      document.getElementById('position').value = '';
      document.getElementById('notes').value    = '';
    } catch (err) {
      showSaveError(err.message || 'Failed to save');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save to Tracksy';
    }
  });
});

// ── Auto-detect job from page ─────────────────────────────────────────────────
function tryDetectJob() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { action: 'getJobInfo' }, (response) => {
      if (chrome.runtime.lastError || !response) return;
      if (response.company)  document.getElementById('company').value  = response.company;
      if (response.position) document.getElementById('position').value = response.position;
      if (response.company || response.position) detectedInfo.style.display = 'block';
    });
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function showMainScreen(server) {
  authScreen.style.display  = 'none';
  mainScreen.style.display  = 'flex';
  logoutBtn.style.display   = 'block';
  serverDisplay.textContent = new URL(server).hostname;
  openTracksy.href          = server.replace(/:\d+$/, ':5173') + '/dashboard';
}

function showAuthError(msg) {
  authError.textContent     = msg;
  authError.style.display   = 'block';
}

function showSaveError(msg) {
  saveError.textContent     = msg;
  saveError.style.display   = 'block';
}
