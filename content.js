'use strict';

// ── Tracking parameters (mirrors rules.json) ────────────
const TRACKING_PARAMS = new Set([
  // Google Analytics / Ads
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid', '_ga', '_gid', '_gl',

  // Facebook / Meta
  'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
  'action_object_map', 'action_type_map', 'action_ref_map',

  // Microsoft / Bing
  'msclkid',

  // Email marketing
  'mc_eid', 'mc_cid', '_bta_tid', '_bta_c', 'vero_id', 'vero_conv',
  'oly_enc_id', 'oly_anon_id', 'ml_subscriber', 'ml_subscriber_hash',
  '_ke', 'sb_referer_host',

  // Social platforms
  'twclid', 'li_fat_id', 'igshid', 's_cid', 'tt_medium', 'tt_content',
  'pin_unauth',

  // Analytics / attribution
  '_hsenc', '_hsmi', '__hssc', '__hstc', '__hsfp', 'hubspotutk',
  'mkt_tok', 'trk', 'wickedid', 'si', 'icid', 'ictx', '__s',
  '_openstat', 'yclid', 'ymclid',

  // Misc / catch-all
  'spm', 'share_source_id', 'vn_source', '_kx', 'scm',
  'irclickid', 'irgwc', 'partner_id', 'campaign_id', 'ad_id',
  'rb_clickid', 'cjevent', 'cjdata', 'zanpid', 'epik', 'pp', 'cpn',
  'sharedid', 'redirect_log_mongo_id', 'redirect_mongo_id',
  'mkwid', 'pcrid', 'ef_id', 's_kwcid', 'dm_i',
  'pk_campaign', 'pk_kwd', 'pk_source', 'pk_medium', 'pk_content',
]);

// ── State ────────────────────────────────────────────────
let isEnabled = true;
let observer = null;
let pendingCount = 0;
let batchTimer = null;

// ── Core: clean a URL string ─────────────────────────────
function cleanURL(href) {
  let url;
  try { url = new URL(href); } catch (_) { return null; }

  // Only clean http/https
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  let count = 0;
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(key.toLowerCase())) {
      url.searchParams.delete(key);
      count++;
    }
  }

  if (count === 0) return null;
  return { url: url.toString(), count };
}

// ── Report stripped count to background ──────────────────
function reportStripped(n) {
  pendingCount += n;
  clearTimeout(batchTimer);
  batchTimer = setTimeout(flushReport, 1000);
}

function flushReport() {
  if (pendingCount <= 0) return;
  try {
    browser.runtime.sendMessage({
      type: 'TRACKERS_STRIPPED',
      count: pendingCount,
    });
  } catch (_) {}
  pendingCount = 0;
}

// ── Job 1: Clean the URL bar ─────────────────────────────
function cleanCurrentURL() {
  const result = cleanURL(window.location.href);
  if (!result) return;

  history.replaceState(null, '', result.url);
  reportStripped(result.count);
}

// ── Job 2: Clean <a> links on the page ───────────────────
function cleanLink(a) {
  if (a.dataset.lovesparkCleaned) return;

  const href = a.getAttribute('href');
  if (!href) return;

  // Skip non-URL values
  if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;

  // Build absolute URL for parsing
  let absolute;
  try { absolute = new URL(href, window.location.origin).href; } catch (_) { return; }

  const result = cleanURL(absolute);
  if (!result) {
    a.dataset.lovesparkCleaned = 'true';
    return;
  }

  // Preserve relative structure if original was relative
  if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
    try {
      const cleaned = new URL(result.url);
      const path = cleaned.pathname + cleaned.search + cleaned.hash;
      a.setAttribute('href', path);
    } catch (_) {
      a.setAttribute('href', result.url);
    }
  } else {
    a.setAttribute('href', result.url);
  }

  a.dataset.lovesparkCleaned = 'true';
  reportStripped(result.count);
}

function cleanAllLinks() {
  const links = document.querySelectorAll('a[href]:not([data-lovespark-cleaned])');
  for (const a of links) {
    cleanLink(a);
  }
}

// ── MutationObserver for dynamic links ───────────────────
function processAddedNodes(mutations) {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      // Check the node itself
      if (node.tagName === 'A') cleanLink(node);

      // Check descendants
      const links = node.querySelectorAll?.('a[href]:not([data-lovespark-cleaned])');
      if (links) {
        for (const a of links) cleanLink(a);
      }
    }
  }
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver(processAddedNodes);
  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (!observer) return;
  observer.disconnect();
  observer = null;
}

// ── Settings propagation via storage.onChanged ───────────
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.isEnabled === undefined) return;

  isEnabled = changes.isEnabled.newValue !== false;

  if (isEnabled) {
    cleanCurrentURL();
    cleanAllLinks();
    startObserver();
  } else {
    stopObserver();
  }
});

// ── Init ─────────────────────────────────────────────────
async function init() {
  try {
    const data = await browser.storage.local.get('isEnabled');
    isEnabled = data.isEnabled !== false;
  } catch (_) {}

  if (!isEnabled) return;

  cleanCurrentURL();
  cleanAllLinks();
  startObserver();
}

init();
