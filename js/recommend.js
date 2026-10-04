// Aura product recommendations — pads & medicine picked from the user's
// own logged condition (flow, symptoms) and mood data.
//
// The catalog and price hints live in the app (offline-first). Tapping a
// shop button needs the internet: we check first and show a friendly popup
// when the user is offline. Nothing is ever presented as a verified product,
// a live price, or a direct purchase — every button opens the country's
// store *search* page for that category.

// ---- connectivity -------------------------------------------------------
// Quick "is the internet actually reachable?" check. navigator.onLine alone
// lies on some networks, so we back it with a tiny no-cors probe.
async function hasInternet(timeoutMs) {
  if (navigator.onLine === false) return false;
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), timeoutMs || 3500);
    await fetch('https://www.google.com/generate_204', {
      mode: 'no-cors', cache: 'no-store', signal: c.signal
    });
    clearTimeout(t);
    return true;
  } catch (e) {
    return false;
  }
}

// ---- generic info popup --------------------------------------------------
let _infoOkCb = null;
function openInfoPopup(title, msg, okCb, okLabel) {
  const T = t();
  $('info-title').textContent = title;
  $('info-msg').textContent = msg;
  $('info-ok').textContent = okLabel || T.infoOk || 'OK';
  _infoOkCb = okCb || null;
  openModal($('info-popup'));
}
function closeInfoPopup() {
  closeModal($('info-popup'));
  const cb = _infoOkCb;
  _infoOkCb = null;
  if (cb) cb();
}

// ---- catalog -------------------------------------------------------------
const SHOPS = {
  mm: [
    { name: 'Shop.com.mm', url: kw => 'https://shop.com.mm/catalogsearch/result/?q=' + encodeURIComponent(kw) }
  ],
  th: [
    { name: 'Shopee', url: kw => 'https://shopee.co.th/search?keyword=' + encodeURIComponent(kw) },
    { name: 'Lazada', url: kw => 'https://www.lazada.co.th/catalog/?q=' + encodeURIComponent(kw) }
  ]
};

// price = estimated street price in the country ("≈", never a live quote).
// kw = store search keywords per country.
const PRODUCTS = {
  pads_day:         { icon: 'period', tint: 'tint-red', price: { mm: '≈ 4,000 Ks', th: '≈ ฿79'  }, kw: { mm: 'sanitary pad',             th: 'ผ้าอนามัยกลางวัน' } },
  pads_night:       { icon: 'period', tint: 'tint-red', price: { mm: '≈ 7,500 Ks', th: '≈ ฿115' }, kw: { mm: 'overnight sanitary pad',   th: 'ผ้าอนามัยกลางคืน' } },
  liners:           { icon: 'period', tint: 'tint-red', price: { mm: '≈ 3,000 Ks', th: '≈ ฿59'  }, kw: { mm: 'panty liner',              th: 'แผ่นอนามัย' } },
  period_underwear: { icon: 'period', tint: 'tint-red', price: { mm: '≈ 15,000 Ks', th: '≈ ฿299' }, kw: { mm: 'period underwear',        th: 'กางเกงในอนามัย' } },
  heat_patch:       { icon: 'sun',    tint: 't-amber', price: { mm: '≈ 2,500 Ks', th: '≈ ฿45' }, kw: { mm: 'heat patch menstrual pain', th: 'แผ่นประคบร้อนปวดประจำเดือน' } },
  pain_relief:      { icon: 'pills',  tint: 'tint-blue',  price: { mm: '≈ 1,500 Ks', th: '≈ ฿35' }, kw: { mm: 'paracetamol',              th: 'ยาพาราเซตามอล' } },
  ginger_tea:       { icon: 'tea',    tint: 'tint-green', price: { mm: '≈ 2,000 Ks', th: '≈ ฿40' }, kw: { mm: 'ginger tea',               th: 'ชาขิง' } }
};

// ---- engine --------------------------------------------------------------
// Conservative rules from the last 60 days of logs. Pads follow flow,
// medicine follows symptoms, tea follows low mood. Medicine is always
// framed as "ask your pharmacist" — never a prescription.
function buildRecommendations() {
  const F = {}, S = {}, M = {};
  const cutoff = toKey(addDays(today(), -60));
  const logs = state.logs || {};
  Object.keys(logs).forEach(k => {
    if (k < cutoff) return;
    const log = logs[k];
    if (log.flow) F[log.flow] = (F[log.flow] || 0) + 1;
    (log.symptoms || []).forEach(s => { S[s] = (S[s] || 0) + 1; });
    if (log.mood) M[log.mood] = (M[log.mood] || 0) + 1;
  });

  if (!Object.keys(logs).length) {
    return [
      { id: 'pads_day', reason: 'recReasonStarter' },
      { id: 'liners',   reason: 'recReasonStarter' }
    ];
  }

  const recs = [{ id: 'pads_day', reason: 'recReasonDaily' }];
  if ((F.heavy || 0) >= 1)    recs.push({ id: 'pads_night', reason: 'recReasonHeavy' });
  if ((F.spotting || 0) >= 1 || (F.light || 0) >= 2)
    recs.push({ id: 'liners', reason: 'recReasonSpotting' });
  if ((F.heavy || 0) >= 2)    recs.push({ id: 'period_underwear', reason: 'recReasonHeavy' });
  if ((S.cramps || 0) >= 1) {
    recs.push({ id: 'heat_patch', reason: 'recReasonCramps' });
    recs.push({ id: 'pain_relief', reason: 'recReasonCramps' });
  } else if ((S.headache || 0) >= 1) {
    recs.push({ id: 'pain_relief', reason: 'recReasonHeadache' });
  }
  if (((M.low || 0) + (M.bad || 0)) >= 2)
    recs.push({ id: 'ginger_tea', reason: 'recReasonMood' });
  return recs;
}

// ---- render --------------------------------------------------------------
function renderRecommendations() {
  const T = t();
  const list = $('rec-list');
  if (!list) return;
  const country = state.data.country === 'th' ? 'th' : 'mm';
  document.querySelectorAll('#country-seg [data-country-val]').forEach(b =>
    b.classList.toggle('active', b.dataset.countryVal === country));

  const recs = buildRecommendations();
  list.innerHTML = recs.map(r => {
    const p = PRODUCTS[r.id];
    const shops = SHOPS[country].map((s, i) =>
      '<button type="button" class="btn ghost small rec-buy" data-buy="' + r.id + ':' + i + '">' +
      '🛒 ' + esc(s.name) + '</button>').join('');
    return '<div class="rec-card">' +
      '<span class="tile ' + (p.tint || 't-pink') + ' rec-ico">' + icon3d(p.icon) + '</span>' +
      '<div class="rec-body">' +
        '<div class="rec-name-row"><span class="rec-name">' + esc(T['recName_' + r.id]) + '</span>' +
        '<span class="rec-price">' + esc(p.price[country]) + '</span></div>' +
        '<div class="rec-desc">' + esc(T['recDesc_' + r.id]) + '</div>' +
        '<div class="rec-reason">💡 ' + esc(T[r.reason]) + '</div>' +
        '<div class="rec-shops">' + shops + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// Open a store search — but only when actually online.
async function buyProduct(pid, shopIdx) {
  const T = t();
  const country = state.data.country === 'th' ? 'th' : 'mm';
  const shop = SHOPS[country][shopIdx];
  const p = PRODUCTS[pid];
  if (!shop || !p) return;
  if (!(await hasInternet())) {
    openInfoPopup(T.recNeedInternetTitle, T.recNeedInternetMsg);
    return;
  }
  window.open(shop.url(p.kw[country]), '_blank', 'noopener');
}

function initRecommendations() {
  const list = $('rec-list');
  if (list) list.addEventListener('click', e => {
    const b = e.target.closest('[data-buy]');
    if (!b) return;
    const parts = b.dataset.buy.split(':');
    buyProduct(parts[0], parseInt(parts[1], 10));
  });
  document.querySelectorAll('#country-seg [data-country-val]').forEach(b =>
    b.addEventListener('click', () => {
      state.data.country = b.dataset.countryVal;
      saveData();
      renderRecommendations();
    }));
  $('info-ok').addEventListener('click', closeInfoPopup);
  $('info-popup').addEventListener('click', e => {
    if (e.target === $('info-popup')) closeInfoPopup();
  });
}

// When the Advice tab opens: offline -> friendly popup (per request),
// online -> the data is simply there. Shown at most once per session so it
// never nags while hopping between tabs.
let _offlineNoticeShown = false;
async function maybeOfflineNotice() {
  if (_offlineNoticeShown) return;
  _offlineNoticeShown = true;
  const T = t();
  if (await hasInternet()) return;
  openInfoPopup(T.recNeedInternetTitle, T.recNeedInternetMsg);
}
