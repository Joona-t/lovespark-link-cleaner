'use strict';

// ── Storage defaults ─────────────────────────────────────
const DEFAULTS = {
  trackersStrippedToday: 0,
  trackersStrippedTotal: 0,
  lastResetDate: todayStr(),
  isEnabled: true,
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Daily reset (no alarms permission needed) ────────────
async function checkDailyReset() {
  const data = await chrome.storage.local.get(['lastResetDate', 'trackersStrippedToday']);
  const today = todayStr();
  if (data.lastResetDate !== today) {
    await chrome.storage.local.set({
      trackersStrippedToday: 0,
      lastResetDate: today,
    });
    return true;
  }
  return false;
}

// ── Debounced stat flush ─────────────────────────────────
let _pendingBump = 0;
let _flushTimer = null;

function bumpStats(n) {
  _pendingBump += n;
  if (!_flushTimer) {
    _flushTimer = setTimeout(flushStats, 500);
  }
}

async function flushStats() {
  _flushTimer = null;
  const n = _pendingBump;
  if (n === 0) return;
  _pendingBump = 0;

  await checkDailyReset();

  const data = await chrome.storage.local.get(['trackersStrippedToday', 'trackersStrippedTotal']);
  await chrome.storage.local.set({
    trackersStrippedToday: (data.trackersStrippedToday || 0) + n,
    trackersStrippedTotal: (data.trackersStrippedTotal || 0) + n,
  });
  await updateBadge();
}

// ── Badge ────────────────────────────────────────────────
async function updateBadge() {
  const data = await chrome.storage.local.get(['isEnabled', 'trackersStrippedToday']);

  if (data.isEnabled === false) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#666666' });
    return;
  }

  const count = data.trackersStrippedToday || 0;
  const text = count > 999 ? '999+' : count > 0 ? String(count) : '';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: '#FF69B4' });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
}

// ── Enable / disable ─────────────────────────────────────
async function setEnabled(enabled) {
  await chrome.storage.local.set({ isEnabled: enabled });

  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['ruleset_1'],
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ['ruleset_1'],
    });
  }

  await updateBadge();
}

// ── Message handler ──────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  handleMessage(msg).then(sendResponse).catch(() => sendResponse({ error: true }));
  return true;
});

async function handleMessage(msg) {
  switch (msg.type) {
    case 'TRACKERS_STRIPPED': {
      bumpStats(msg.count || 0);
      return { ok: true };
    }
    case 'GET_STATS': {
      await checkDailyReset();
      return chrome.storage.local.get([
        'trackersStrippedToday',
        'trackersStrippedTotal',
        'isEnabled',
      ]);
    }
    case 'SET_ENABLED': {
      await setEnabled(msg.enabled);
      return { ok: true };
    }
    default:
      return { error: 'Unknown message type' };
  }
}

// ── Lifecycle ────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const updates = {};
  for (const [key, val] of Object.entries(DEFAULTS)) {
    if (data[key] === undefined) updates[key] = val;
  }
  if (Object.keys(updates).length) await chrome.storage.local.set(updates);

  chrome.action.setBadgeBackgroundColor({ color: '#FF69B4' });
  await updateBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  await checkDailyReset();
  chrome.action.setBadgeBackgroundColor({ color: '#FF69B4' });
  await updateBadge();
});
