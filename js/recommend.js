// Aura product recommendations — the best pick for the user's own logged
// condition (flow, symptoms, mood), vetted per country of residence.
//
// The catalog and price hints live in the app (offline-first). Prices are
// "≈" street estimates, never live quotes. Brand names are common examples,
// not endorsements and not verified stock. Medicine cards always point at
// the pharmacist — never a prescription.

// ---- connectivity -------------------------------------------------------
// Quick "is the internet actually reachable?" check. navigator.onLine alone
// lies on some networks, so we back it with a tiny no-cors probe.
// (Shared with the updater in main.js.)
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
// (also used by the updater in main.js)
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
// name = the concrete product to look for, per country.
// tip  = one extra honest line (example brands / where to find it).
// benefits live in i18n as recBen_<id> so both languages stay in sync.
const PRODUCTS = {
  pads_day: {
    icon: 'period', tint: 't-pink', cat: 'pads',
    name: { mm: 'Sofy / Laurier — နေ့သုံး', th: 'Sofy / Laurier / Whisper (กลางวัน)' },
    price: { mm: '≈ 4,000 Ks', th: '≈ ฿79' },
    tip: { mm: null, th: null }
  },
  pads_night: {
    icon: 'period', tint: 't-pink', cat: 'pads',
    name: { mm: 'Sofy / Laurier — ညသုံး', th: 'Sofy / Laurier (กลางคืน)' },
    price: { mm: '≈ 7,500 Ks', th: '≈ ฿115' },
    tip: { mm: null, th: null }
  },
  liners: {
    icon: 'period', tint: 't-pink', cat: 'pads',
    name: { mm: 'Sofy / Laurier — panty liner', th: 'Sofy / Laurier — แผ่นอนามัย' },
    price: { mm: '≈ 3,000 Ks', th: '≈ ฿59' },
    tip: { mm: null, th: null }
  },
  period_underwear: {
    icon: 'period', tint: 't-pink', cat: 'pads',
    name: { mm: 'Period underwear (အွန်လိုင်းဆိုင်)', th: 'Period underwear (ออนไลน์)' },
    price: { mm: '≈ 15,000 Ks', th: '≈ ฿299' },
    tip: { mm: null, th: null }
  },
  heat_patch: {
    icon: 'sun', tint: 't-amber', cat: 'relief',
    name: { mm: 'ရေနွေးအိတ် (Hot water bag)', th: 'ThermaPlast — แผ่นประคบร้อน' },
    price: { mm: '≈ 4,000 Ks', th: '≈ ฿35' },
    tip: { mm: '📍 ဆေးဆိုင် · စူပါမားကတ်တွေမှာ ရနိုင်ပါတယ်', th: '📍 7-Eleven · Watsons · Boots' }
  },
  pain_relief: {
    icon: 'pills', tint: 't-blue', cat: 'relief',
    name: { mm: 'Paracetamol 500mg · Ibuprofen 400mg', th: 'Paracetamol 500mg · Ibuprofen 400mg' },
    price: { mm: '≈ 1,500 Ks', th: '≈ ฿35' },
    tip: { mm: '🏷️ ဥပမာ — Biogesic, Brufen, Ponstan', th: '🏷️ e.g. — Sara, Gofen, Ponstan' }
  },
  ginger_tea: {
    icon: 'tea', tint: 't-green', cat: 'relief',
    name: { mm: 'ဂျင်းလက်ဖက်ရည် အထုပ်', th: 'ชาขิงซอง' },
    price: { mm: '≈ 2,000 Ks', th: '≈ ฿40' },
    tip: { mm: null, th: null }
  }
};

// ---- engine --------------------------------------------------------------
// Conservative rules from the last 60 days of logs. Pads follow flow,
// medicine follows symptoms, tea follows low mood / nausea / bloating.
// Medicine is always framed as "ask your pharmacist" — never a prescription.
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

  if ((S.cramps || 0) >= 1 || (S.backpain || 0) >= 2) {
    recs.push({ id: 'heat_patch', reason: (S.cramps || 0) >= 1 ? 'recReasonCramps' : 'recReasonBackpain' });
  }
  if ((S.cramps || 0) >= 1) {
    recs.push({ id: 'pain_relief', reason: 'recReasonCramps' });
  } else if ((S.headache || 0) >= 1) {
    recs.push({ id: 'pain_relief', reason: 'recReasonHeadache' });
  } else if ((S.backpain || 0) >= 2) {
    recs.push({ id: 'pain_relief', reason: 'recReasonBackpain' });
  }

  if (((M.low || 0) + (M.bad || 0)) >= 2) {
    recs.push({ id: 'ginger_tea', reason: 'recReasonMood' });
  } else if ((S.nausea || 0) >= 2) {
    recs.push({ id: 'ginger_tea', reason: 'recReasonNausea' });
  } else if ((S.bloating || 0) >= 3) {
    recs.push({ id: 'ginger_tea', reason: 'recReasonBloating' });
  }
  return recs;
}

// ---- render --------------------------------------------------------------
// Clean informational cards: type, name, estimated price, benefits,
// and one subtle "why this" line. No shop links — the card itself is the
// answer, vetted for the user's country.
function recCardHTML(T, country, r) {
  const p = PRODUCTS[r.id];
  const tip = (p.tip || {})[country];
  const bens = T['recBen_' + r.id] || [];
  return '<article class="rec-card">' +
    '<span class="tile ' + (p.tint || 't-pink') + ' rec-ico">' + icon3d(p.icon) + '</span>' +
    '<div class="rec-body">' +
      '<div class="rec-head"><p class="rec-type">' + esc(T['recType_' + r.id] || '') + '</p>' +
      '<span class="rec-price">' + esc(p.price[country]) + '</span></div>' +
      '<h4 class="rec-name">' + esc(p.name[country]) + '</h4>' +
      (tip ? '<p class="rec-tip">' + esc(tip) + '</p>' : '') +
      (bens.length ? '<ul class="rec-ben">' +
        bens.map(b => '<li>' + esc(b) + '</li>').join('') + '</ul>' : '') +
      '<p class="rec-why">💡 ' + esc(T[r.reason]) + '</p>' +
    '</div>' +
  '</article>';
}

function renderRecommendations() {
  const T = t();
  const list = $('rec-list');
  if (!list) return;
  const country = state.data.country === 'th' ? 'th' : 'mm';
  document.querySelectorAll('#country-seg [data-country-val]').forEach(b =>
    b.classList.toggle('active', b.dataset.countryVal === country));

  const recs = buildRecommendations();
  const groups = [
    { cat: 'pads', title: T.lblCatPads },
    { cat: 'relief', title: T.lblCatRelief }
  ];
  let html = '';
  groups.forEach(g => {
    const items = recs.filter(r => PRODUCTS[r.id].cat === g.cat);
    if (!items.length) return;
    html += '<h4 class="rec-cat">' + esc(g.title) + '</h4>';
    html += items.map(r => recCardHTML(T, country, r)).join('');
  });
  list.innerHTML = html;
}

// Country switch just re-renders with the other country's vetted data.
function initRecommendations() {
  document.querySelectorAll('#country-seg [data-country-val]').forEach(b =>
    b.addEventListener('click', () => {
      state.data.country = b.dataset.countryVal;
      saveData();
      renderRecommendations();
    }));
  // generic popup bindings (also used by the updater in main.js)
  $('info-ok').addEventListener('click', closeInfoPopup);
  $('info-popup').addEventListener('click', e => {
    if (e.target === $('info-popup')) closeInfoPopup();
  });
}
