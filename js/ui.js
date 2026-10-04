// Rendering. Reads state, writes DOM. No event listeners.

let currentTab = 'tab-home';

const els = {
  headerGreet: $('header-greet'),
  headerTitle: $('header-title'),
  sideTitle: $('side-title'),
  sideSubtitle: $('side-subtitle'),
  langSeg: $('hdr-langseg'),
  langSelectDesktop: $('lang-select-desktop'),
  hdrTheme: $('hdr-theme'),
  hdrUpdate: $('hdr-update'),
  themeToggleDesktop: $('theme-toggle-desktop'),

  alarm: $('alarm-banner'),
  alarmText: $('alarm-text'),

  pill: $('today-pill'),
  pillText: $('pill-text'),

  hmPeriod: $('hm-period'),
  hmFertile: $('hm-fertile'),
  hmOvu: $('hm-ovu'),
  hmRingDay: $('hm-ring-day'),
  hmRingProg: $('hm-ring-prog'),
  hmHeroStatus: $('hm-hero-status'),
  sumCycle: $('sum-cycle'),
  sumPeriod: $('sum-period'),
  sumLogs: $('sum-logs'),
  cycleBars: $('cycle-bars'),

  calTitle: $('cal-title'),
  calDays: $('cal-days'),
  weekdays: $('weekdays'),
  calPrev: $('cal-prev'),
  calNext: $('cal-next'),

  search: $('search-input'),
  monthFilter: $('month-filter'),
  historyList: $('history-list'),

  statDay: $('stat-day'),
  statCycle: $('stat-cycle'),
  statPeriod: $('stat-period'),
  statLeft: $('stat-left'),
  insRingProg: $('ins-ring-prog'),
  insRingDay: $('ins-ring-day'),
  insHeroSub: $('ins-hero-sub'),
  predictions: $('predictions'),
  symChart: $('sym-chart'),
  flowDonut: $('flow-donut'),
  flowLegend: $('flow-legend'),
  moodChart: $('mood-chart'),
  moodInsight: $('insight-mood'),
  statTotal: $('stat-total'),
  statMonth: $('stat-month'),

  form: $('settings-form'),
  setName: $('set-name'),
  setLast: $('set-last'),
  setCycle: $('set-cycle'),
  setPeriod: $('set-period'),
  setLuteal: $('set-luteal'),
  setNotify: $('set-notify'),
  setNotifyDays: $('set-notify-days'),
  setBot: $('set-bot'),
  setRemindLog: $('set-remind-log'),
  setRemindTime: $('set-remind-time'),
  setWellness: $('set-wellness'),
  setBotName: $('set-bot-name'),
  setAge: $('set-age'), setWeight: $('set-weight'), setHeight: $('set-height'),
  adviceTitle: $('advice-title'),
  notifDot: $('notif-dot'),
  notifStatusText: $('notif-status-text'),
  notifPermBtn: $('btn-notif-perm'),
  notifDeniedHint: $('notif-denied-hint'),

  adviceBot: $('advice-bot'),
  advicePermNote: $('advice-perm-note'),
  advicePermBtn: $('advice-perm-btn'),
  adviceToday: $('advice-today'),
  doctorFlagsList: $('doctor-flags-list'),

  botHello: $('bot-hello'),
  botHelloBot: $('bot-hello-bot'),
  botHelloTitle: $('bot-hello-title'),
  botHelloMsg: $('bot-hello-msg'),
  botHelloClose: $('bot-hello-close'),

  installNudge: $('install-nudge'),
  installNotifBtn: $('install-notif-btn'),
  installGotit: $('install-gotit'),

  welcome: $('welcome'),
  welcomeForm: $('welcome-form'),

  logModal: $('log-modal'),
  logTitle: $('log-title'),
  logDate: $('log-date'),
  logPhase: $('log-phase'),
  logFlowRow: $('flow-row'),
  logSymRow: $('sym-row'),
  logMoodRow: $('mood-row'),
  logNotes: $('log-notes'),
  logSave: $('log-save'),
  logAdvice: $('log-advice'),
  phaseModal: $('phase-modal'),
  phaseIco: $('phase-ico'),
  phaseTitle: $('phase-title'),
  phaseDate: $('phase-date'),
  phaseDesc: $('phase-desc'),
  phaseTips: $('phase-tips'),
  phaseClose: $('phase-close'),
  logDelete: $('log-delete'),
  logClose: $('log-close'),
  adviceBox: $('advice-box'),
  adviceList: $('advice-list'),

  confirmModal: $('confirm'),
  confirmTitle: $('c-title'),
  confirmMsg: $('c-msg'),
  confirmOk: $('c-ok'),
  confirmCancel: $('c-cancel'),

  importModal: $('import'),
  importText: $('import-text'),
  importClose: $('import-close'),
  importGo: $('import-go')
};

// ---------- toast ----------
function toast(msg, kind) {
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  $('toasts').appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2400);
}

// ---------- notifications ----------
// one place for every reminder: a cute chime + an in-app card with the bot,
// plus a real system notification (with the bot as its icon) when allowed.
// the in-app card means it still delights even if permission was denied.
let audioCtx = null;
function unlockAudio() {
  // browsers only let us make noise after the user has tapped something once
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (_) { /* no audio, no problem */ }
}

// the bot's little "boing!" when you tap it. synthesized, no files needed.
function playBoing() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(260, t0);
  o.frequency.exponentialRampToValueAtTime(680, t0 + 0.12);
  o.frequency.exponentialRampToValueAtTime(440, t0 + 0.2);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + 0.28);
}

function playChime() {
  try {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    [659.25, 880].forEach((freq, i) => { // little E5 -> A5 chirp. cheerful!
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      const s = t0 + i * 0.14;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.22, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.4);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(s); o.stop(s + 0.45);
    });
  } catch (_) { /* silence is fine too */ }
}

function systemNotify(title, body, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const payload = {
    body,
    icon: 'bot-icon.svg',
    badge: 'bot-icon.svg',
    tag: tag || 'aura',
    vibrate: [120, 60, 120] // little buzz-buzz on phones
  };
  const legacy = () => { try { new Notification(title, payload); } catch (_) {} };
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(
      reg => { try { reg.showNotification(title, payload); } catch (_) { legacy(); } },
      legacy
    );
  } else {
    legacy();
  }
}

function botToast(title, msg) {
  const wrap = document.createElement('div');
  wrap.className = 'toast bot-toast show';
  wrap.setAttribute('role', 'status');
  wrap.innerHTML = botHTML('happy');
  const txt = document.createElement('div');
  txt.className = 'bot-toast-text';
  const h = document.createElement('div');
  h.className = 'bot-toast-title';
  h.textContent = title;
  const p = document.createElement('div');
  p.textContent = msg;
  txt.append(h, p);
  wrap.append(txt);
  wrap.addEventListener('click', () => wrap.remove());
  $('toasts').appendChild(wrap);
  setTimeout(() => {
    wrap.classList.remove('show');
    setTimeout(() => wrap.remove(), 350);
  }, 5000);
}

function notifyUser(title, body, tag) {
  playChime();
  botToast(title, body);
  systemNotify(title, body, tag);
}

// shows whether reminders can actually reach the user, right in settings
function updateNotifStatus() {
  const T = t();
  if (!('Notification' in window)) {
    els.notifStatusText.textContent = T.notifUnsupported;
    els.notifDot.className = 'notif-dot off';
    els.notifPermBtn.classList.add('hidden');
    els.notifDeniedHint.classList.add('hidden');
    return;
  }
  const perm = Notification.permission;
  if (perm === 'granted') {
    els.notifStatusText.textContent = T.notifGranted;
    els.notifDot.className = 'notif-dot on';
    els.notifPermBtn.classList.add('hidden');
    els.notifDeniedHint.classList.add('hidden');
  } else if (perm === 'denied') {
    els.notifStatusText.textContent = T.notifDenied;
    els.notifDot.className = 'notif-dot off';
    els.notifPermBtn.classList.add('hidden');
    els.notifDeniedHint.classList.remove('hidden');
  } else {
    els.notifStatusText.textContent = T.notifDefault;
    els.notifDot.className = 'notif-dot wait';
    els.notifPermBtn.classList.remove('hidden');
    els.notifDeniedHint.classList.add('hidden');
  }
}

// ---------- confirm ----------
let confirmResolve = null;
function askConfirm(title, msg) {
  els.confirmTitle.textContent = title;
  els.confirmMsg.textContent = msg;
  openModal(els.confirmModal);
  return new Promise(r => { confirmResolve = r; });
}
function closeConfirm(val) {
  els.confirmModal.classList.add('hidden');
  unlockScroll();
  if (confirmResolve) confirmResolve(val);
  confirmResolve = null;
}

// ---------- modal helpers: scroll lock + focus ----------
let lastFocused = null;
function lockScroll() { document.body.classList.add('no-scroll'); }
function unlockScroll() {
  if (!document.querySelector('.modal:not(.hidden)')) {
    document.body.classList.remove('no-scroll');
  }
}
function trapTab(e, modal) {
  if (e.key !== 'Tab') return;
  const items = [...modal.querySelectorAll('button, input, select, textarea, [tabindex]')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openModal(modal) {
  lastFocused = document.activeElement;
  modal.classList.remove('hidden');
  lockScroll();
  const box = modal.querySelector('.modal-box');
  if (box) {
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });
  }
  modal.onkeydown = e => trapTab(e, modal);
}
function closeModal(modal) {
  modal.classList.add('hidden');
  modal.onkeydown = null;
  unlockScroll();
  if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  lastFocused = null;
}

// ---------- language / theme ----------
function applyLang() {
  const T = t();

  document.querySelectorAll('[data-lbl]').forEach(el => {
    const key = el.dataset.lbl;
    if (T[key] && typeof T[key] !== 'function') el.textContent = T[key];
  });

  document.querySelectorAll('[data-ph]').forEach(el => {
    const key = el.dataset.ph;
    if (T[key] && typeof T[key] !== 'function') el.placeholder = T[key];
  });

  els.sideTitle.textContent = state.data.userName || 'Aura';
  els.sideSubtitle.textContent = T.appSubtitle;
  if (els.langSeg) els.langSeg.querySelectorAll('[data-lang-val]').forEach(b =>
    b.classList.toggle('active', b.dataset.langVal === state.lang));
  renderHeader();

  els.search.placeholder = T.searchPlaceholder;

  els.weekdays.innerHTML = T.weekdays.map(w => `<div>${w}</div>`).join('');

  els.logFlowRow.querySelectorAll('.chip').forEach(c => {
    const k = c.dataset.flow; if (T.flows[k]) c.textContent = T.flows[k];
  });
  els.logSymRow.querySelectorAll('.chip').forEach(c => {
    const k = c.dataset.sym; if (T.chips[k]) c.textContent = T.chips[k];
  });
  els.logMoodRow.querySelectorAll('.chip').forEach(c => {
    const k = c.dataset.mood; if (T.moods[k]) c.textContent = T.moods[k];
  });

  els.langSelectDesktop.value = state.lang;
  document.documentElement.lang = state.lang;

  refreshBotSlots();
  updateNotifStatus();
  if (document.getElementById('tab-advice').classList.contains('active')) renderAdvicePage();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const icon = state.theme === 'dark' ? '☀️' : '🌙';
  els.themeToggleDesktop.textContent = icon;
  // header theme button shows the icon of the mode you'll switch *to*
  if (els.hdrTheme && typeof icon3d === 'function')
    els.hdrTheme.innerHTML = icon3d(state.theme === 'dark' ? 'sun' : 'moon');
  localStorage.setItem(LS.theme, state.theme);
}

function setTheme(val) {
  state.theme = val === 'dark' ? 'dark' : 'light';
  applyTheme();
}

function setLang(val) {
  state.lang = val === 'en' ? 'en' : 'my';
  localStorage.setItem(LS.lang, state.lang);
  applyLang();
  renderAll();
  renderBotHello(); // re-render the greeting card too if it's showing
}

// ---------- the little bot ----------
// expr can be 'happy' (default), 'sad' or 'sleepy' — the face changes to match.
// pass big=true for the chunkier greeting-card version.
// the bot's name, renameable in settings. defaults to Aura.
function botName() {
  const n = (state.data.botName || '').trim();
  return n || 'Aura';
}

// our helper bot, now a proper 3D little buddy. three moods, all cute.
// tap it and it boings.
function botHTML(expr, big) {
  // flipped off in settings? then no bot. simple as that.
  if (state.data.showBot === false) return '';
  const mood = (expr === 'sad' || expr === 'sleepy') ? expr : 'happy';
  return `<img class="bot3d${big ? ' bot3d-big' : ''}" src="${BOT_IMGS[mood]}" alt="${esc(botName())}" draggable="false">`;
}

// fills every placeholder with the bot (or clears them when turned off).
// slots marked data-big get the chunkier version.
function refreshBotSlots() {
  document.querySelectorAll('.bot-slot').forEach(el => {
    el.innerHTML = botHTML('happy', el.hasAttribute('data-big'));
  });
}

const MOOD_SCORE = { great: 4, good: 3, okay: 2, low: 1, bad: 0 };

// how has the mood been trending over the last week? 'up', 'down' or null.
function moodTrend() {
  const scores = [];
  for (let i = 0; i < 7; i++) {
    const k = toKey(addDays(today(), -i));
    const m = state.logs[k] && state.logs[k].mood;
    if (m && m in MOOD_SCORE) scores.push(MOOD_SCORE[m]);
  }
  if (scores.length < 3) return null; // not enough to call it a trend
  const half = Math.ceil(scores.length / 2);
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  const diff = avg(scores.slice(0, half)) - avg(scores.slice(half));
  if (diff <= -0.75) return 'down';
  if (diff >= 0.75) return 'up';
  return null;
}

// most recent logged mood in the last few days, if any
function latestMood() {
  for (let i = 0; i < 4; i++) {
    const k = toKey(addDays(today(), -i));
    const m = state.logs[k] && state.logs[k].mood;
    if (m && m in MOOD_SCORE) return m;
  }
  return null;
}

// the welcome card on the home tab. once a day, only when the bot is on.
let lastGreetLang = null; // language the greeting card was last rendered in
function renderBotHello() {
  if (state.data.showBot === false) return;
  const key = toKey(today());
  const greetedToday = localStorage.getItem(LS.greeted) === key;
  // already said hi today in this language → leave it alone.
  // but if the card is still showing in the other language, re-render it translated
  // (without resurrecting a card the user already dismissed).
  if (greetedToday && lastGreetLang === state.lang) return;
  if (greetedToday && els.botHello.classList.contains('hidden')) return;

  const T = t();
  const hour = new Date().getHours();
  const name = state.data.userName;
  const title = hour < 12 ? T.greetMorning(name)
    : hour < 17 ? T.greetAfternoon(name)
    : T.greetEvening(name);

  let msg = T.greetGeneric;
  let expr = 'happy';

  const info = cycleInfoFor(today());
  const trend = moodTrend();
  const mood = latestMood();

  if (info && isSameDay(info.start, today())) {
    msg = T.greetPeriodDay1; // day one. be gentle.
  } else if (trend === 'down') {
    msg = T.greetTrendDown;
    expr = 'sad';
  } else if (trend === 'up') {
    msg = T.greetTrendUp;
  } else if (mood && T.moodTips[mood]) {
    msg = T.moodTips[mood]; // a little tip matched to how they've been feeling
    if (mood === 'low' || mood === 'bad') expr = 'sad';
  } else if (!state.logs[key]) {
    msg = T.greetLogNudge;
  }

  if (hour >= 22 || hour < 5) expr = 'sleepy'; // up late? bot gets sleepy too

  els.botHelloBot.innerHTML = botHTML(expr, true);
  els.botHelloTitle.textContent = title;
  els.botHelloMsg.textContent = msg;
  els.botHello.classList.remove('hidden');
  localStorage.setItem(LS.greeted, key);
  lastGreetLang = state.lang;
}

// ---------- install nudge ----------
// one-time popup: install to home screen + allow notifications,
// so reminders can actually fire in the background.
function isInstalled() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || window.navigator.standalone === true; // old iOS
}

function maybeShowInstallNudge() {
  if (isInstalled()) return; // already doing it right, no nagging
  if (localStorage.getItem(LS.installNudge)) return; // shown before
  if (!els.welcome.classList.contains('hidden')) return; // welcome still up; next open tries again
  setTimeout(() => {
    if (!els.welcome.classList.contains('hidden')) return;
    if (localStorage.getItem(LS.installNudge)) return;
    refreshBotSlots();
    openModal(els.installNudge);
  }, 1200); // let the greeting land first
}

// ---------- wellness nudges ----------
// little contextual reminders ("did you drink warm water?").
// each fires at most once a day, and only one per app open — no spam, promise.
const NUDGE_DEFS = [
  { id: 'warm-water', when: ctx => ctx.phase === 'menstrual' },
  { id: 'heat-pad', when: ctx => ctx.recentSymptom('cramps', 2) },
  { id: 'iron-foods', when: ctx => ctx.recentFlow('heavy', 3) },
  { id: 'gentle-move', when: ctx => ctx.recentSymptom('bloating', 3) },
  { id: 'sleep-well', when: ctx => ctx.recentSymptom('tired', 3) || ctx.phase === 'luteal' },
  { id: 'hydrate', when: ctx => ctx.recentSymptom('headache', 2) },
];

function nudgeContext() {
  const entryOn = i => state.logs[toKey(addDays(today(), -i))];
  return {
    phase: phaseFor(today()),
    recentSymptom: (s, days) => {
      for (let i = 0; i < days; i++) {
        const e = entryOn(i);
        if (e && (e.symptoms || []).includes(s)) return true;
      }
      return false;
    },
    recentFlow: (f, days) => {
      for (let i = 0; i < days; i++) {
        const e = entryOn(i);
        if (e && e.flow === f) return true;
      }
      return false;
    }
  };
}

function isNudgeOn(id) {
  if (state.data.wellnessNudges === false) return false;
  return (state.data.nudgePrefs || {})[id] !== false;
}

function checkWellnessNudges() {
  if (state.data.wellnessNudges === false) return;
  const key = toKey(today());
  const ctx = nudgeContext();
  const T = t();
  for (const def of NUDGE_DEFS) {
    if (!isNudgeOn(def.id)) continue;
    if (localStorage.getItem(LS.nudge + def.id) === key) continue;
    let match = false;
    try { match = def.when(ctx); } catch (_) { match = false; }
    if (!match) continue;
    localStorage.setItem(LS.nudge + def.id, key);
    const n = T.nudges[def.id];
    if (n) notifyUser(n.title, n.body, 'aura-nudge-' + def.id);
    break;
  }
}

// ---------- advice ----------
function adviceHTML(symptoms, withTitle) {
  const T = t();
  if (!symptoms || !symptoms.length) return '';

  const seen = new Set();
  const items = [];
  for (const s of symptoms) {
    const text = T.advices[s];
    if (!text || seen.has(text)) continue;
    seen.add(text);
    items.push(`<li>${esc(text)}</li>`);
  }
  if (!items.length) return '';

  const list = `<ul class="advice-list">${items.join('')}</ul>`;
  if (!withTitle) return list;
  return `<div class="advice-block"><h4>${esc(T.lblAdviceHeading)}</h4>${list}</div>`;
}

// Collapsible version for history cards — keeps cards compact on mobile.
// The <details> is collapsed by default so long tip lists don't blow up the layout.
function adviceDetailsHTML(symptoms) {
  const T = t();
  if (!symptoms || !symptoms.length) return '';

  const seen = new Set();
  const items = [];
  for (const s of symptoms) {
    const text = T.advices[s];
    if (!text || seen.has(text)) continue;
    seen.add(text);
    items.push(`<li>${esc(text)}</li>`);
  }
  if (!items.length) return '';

  return `<details class="advice-details"><summary>${botHTML()}<span>${esc(T.lblAdviceHeading)} (${items.length})</span></summary><ul class="advice-list">${items.join('')}</ul></details>`;
}

// ---------- advice page ----------
// reads the user's own history and puts together guidance that actually fits.
function renderAdvicePage() {
  const T = t();
  els.adviceTitle.textContent = T.lblAdvicePageTitle(botName());
  const list = els.adviceToday;
  list.innerHTML = '';

  // came here straight from the log modal? show what the advice is based on.
  const focus = state.adviceFocus;
  if (focus) {
    const bits = [];
    if (focus.mood && T.moods[focus.mood]) bits.push(T.moods[focus.mood]);
    (focus.symptoms || []).forEach(s => { if (T.chips[s]) bits.push(T.chips[s]); });
    if (focus.flow && T.flows[focus.flow]) bits.push(T.flows[focus.flow]);
    if (bits.length) {
      const banner = document.createElement('div');
      banner.className = 'advice-card advice-focus';
      banner.innerHTML = `<div class="advice-card-kicker">${esc(T.lblAdviceJustLogged)}</div>` +
        `<div class="focus-chips">${bits.map(b => `<span class="focus-chip">${esc(b)}</span>`).join('')}</div>`;
      list.appendChild(banner);
    }
    state.adviceFocus = null;
  }

  const trend = moodTrend();
  els.adviceBot.innerHTML = botHTML(trend === 'down' ? 'sad' : 'happy', true);

  const perm = ('Notification' in window) ? Notification.permission : 'denied';
  els.advicePermNote.classList.toggle('hidden', perm === 'granted');

  const cards = [];
  const info = cycleInfoFor(today());
  const phase = phaseFor(today());

  // phase card — always relevant, grounded in what research actually says
  if (phase && T.phaseAdvice && T.phaseAdvice[phase]) {
    const pa = T.phaseAdvice[phase];
    const day = info ? Math.max(1, diffDays(info.start, today()) + 1) : null;
    cards.push({
      title: pa.title,
      body: pa.body,
      why: day ? T.reasonPhase(day, phaseLabel(phase)) : '',
      nudge: phase === 'menstrual' ? 'warm-water' : null
    });
  }

  // mood card — trend-aware
  const mood = latestMood();
  if (mood && T.moodTips[mood]) {
    let body = T.moodTips[mood];
    if (trend === 'down') body = T.greetTrendDown + ' ' + body;
    else if (trend === 'up') body = T.greetTrendUp + ' ' + body;
    cards.push({ title: T.lblInsightMood, body, why: T.reasonMood, nudge: null });
  }

  // top recent symptoms (last 14 days, max 2 cards so it stays readable)
  const counts = {};
  const lastSeen = {};
  for (let i = 0; i < 14; i++) {
    const k = toKey(addDays(today(), -i));
    const e = state.logs[k];
    ((e && e.symptoms) || []).forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
      if (!(s in lastSeen)) lastSeen[s] = i;
    });
  }
  const nudgeMap = { cramps: 'heat-pad', headache: 'hydrate', bloating: 'gentle-move', tired: 'sleep-well' };
  Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([s]) => {
    const tip = T.advices[s];
    if (!tip) return;
    cards.push({
      title: T.chips[s] || s,
      body: tip,
      why: T.reasonSymptom(T.chips[s] || s, lastSeen[s]),
      nudge: nudgeMap[s] || null
    });
  });

  if (!cards.length) {
    list.innerHTML = `<div class="empty-state"><div class="ico">🌸</div><div>${T.noData}</div></div>`;
  } else {
    for (const c of cards) {
      const card = document.createElement('div');
      card.className = 'advice-card';

      const head = document.createElement('div');
      head.className = 'advice-card-head';
      head.innerHTML = botHTML('happy');
      const h3 = document.createElement('h3');
      h3.textContent = c.title;
      head.appendChild(h3);
      card.appendChild(head);

      const p = document.createElement('p');
      p.textContent = c.body;
      card.appendChild(p);

      if (c.why) {
        const w = document.createElement('div');
        w.className = 'advice-why';
        const b = document.createElement('b');
        b.textContent = T.lblAdviceWhy + ': ';
        w.append(b, document.createTextNode(c.why));
        card.appendChild(w);
      }

      if (c.nudge && isNudgeOn(c.nudge)) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn ghost small remind-btn';
        btn.dataset.nudgeRemind = c.nudge;
        btn.textContent = T.btnRemindMe;
        card.appendChild(btn);
      }

      list.appendChild(card);
    }
  }

  const flags = T.doctorFlags || [];
  els.doctorFlagsList.innerHTML = flags.map(f => `<li>${esc(f)}</li>`).join('');
  const strip = document.getElementById('doctor-strip');
  if (strip) strip.classList.toggle('hidden', !flags.length);

  if (typeof renderRecommendations === 'function') renderRecommendations();
}

// ---------- home ----------
function renderTodayPill() {
  if (!els.pill) return; // retired in the redesign; hero shows this now
  const T = t();
  const phase = phaseFor(today());
  if (!phase) {
    els.pillText.textContent = `${T.todayLabel} —`;
    els.pill.className = 'today-pill';
    return;
  }
  const info = cycleInfoFor(today());
  const day = Math.max(1, diffDays(info.start, today()) + 1);
  els.pillText.textContent = `${T.todayLabel} · Day ${day} · ${phaseLabel(phase)}`;
  els.pill.className = 'today-pill p-' + phase;
}

function renderHeader() {
  const T = t();
  if (currentTab === 'tab-home') {
    const h = new Date().getHours();
    els.headerGreet.textContent = h < 12 ? T.hdGreetMorning : h < 17 ? T.hdGreetAfternoon : T.hdGreetEvening;
    els.headerGreet.classList.remove('hidden');
    els.headerTitle.textContent = (state.data.userName || T.hdFallbackName) + '!';
  } else {
    els.headerGreet.classList.add('hidden');
    const keys = { 'tab-advice': 'navAdvice', 'tab-insights': 'navInsights', 'tab-history': 'navHistory', 'tab-settings': 'navSettings' };
    els.headerTitle.textContent = T[keys[currentTab]] || '';
  }
}

// the four date windows on home — shared by the stats, banner and popups.
function cycleWindows() {
  const info = cycleInfoFor(today());
  if (!info) return null;
  let pStart = info.start, pEnd = info.periodEnd;
  let fStart = info.fertileStart, fEnd = info.fertileEnd;
  let ovu = info.ovulation;
  const nxt = info.nextStart;
  if (today() > info.periodEnd) {
    pStart = info.nextStart;
    pEnd = addDays(info.nextStart, state.data.periodLength - 1);
  }
  if (today() > info.fertileEnd) {
    const ni = cycleInfoFor(addDays(info.start, state.data.cycleLength));
    fStart = ni.fertileStart; fEnd = ni.fertileEnd; ovu = ni.ovulation;
  }
  return {
    pStart, pEnd, fStart, fEnd, ovu, nxt,
    pDays: state.data.periodLength,
    fDays: diffDays(fStart, fEnd) + 1,
    left: diffDays(today(), nxt)
  };
}

// the four key numbers on home — shared by the stats card, banner and popups.
function renderStats() {
  const T = t();
  const w = cycleWindows();
  const info = cycleInfoFor(today());
  const C = 2 * Math.PI * 60; // home hero ring circumference
  if (!w || !info) {
    els.hmPeriod.textContent = '\u2013';
    els.hmFertile.textContent = '\u2013';
    els.hmOvu.textContent = '\u2013';
    if (els.hmRingDay) els.hmRingDay.textContent = '\u2013';
    if (els.hmHeroStatus) els.hmHeroStatus.textContent = '';
    return;
  }
  const day = Math.max(1, diffDays(info.start, today()) + 1);
  const cycLen = state.data.cycleLength || 28;
  els.hmPeriod.textContent = T.dayOfCycle(day);
  els.hmFertile.textContent = `${w.fDays} ${T.daysUnit}`;
  els.hmOvu.textContent = fmtShort(w.ovu);

  // home hero ring, like the reference's progress ring
  if (els.hmRingDay) els.hmRingDay.textContent = day;
  if (els.hmRingProg) els.hmRingProg.style.strokeDasharray = `${Math.min(day / cycLen, 1) * C} ${C}`;
  if (els.hmHeroStatus) {
    const phase = phaseFor(today());
    els.hmHeroStatus.textContent = phase ? `${T.dayOfCycle(day)} · ${phaseLabel(phase)}` : T.dayOfCycle(day);
  }

  checkAlarm(w.left);
  celebrateCycleStart(w.pStart);
}

// period starts detected from logged flow entries (a flow day after a gap)
function loggedPeriodStarts() {
  const keys = Object.keys(state.logs || {}).filter(k => state.logs[k] && state.logs[k].flow).sort();
  const starts = [];
  keys.forEach(k => {
    const prev = toKey(addDays(parseDate(k), -1));
    if (!(state.logs[prev] && state.logs[prev].flow)) starts.push(k);
  });
  return starts;
}

function renderSummary() {
  els.sumCycle.textContent = state.data.cycleLength || '\u2013';
  els.sumPeriod.textContent = state.data.periodLength || '\u2013';
  els.sumLogs.textContent = Object.keys(state.logs || {}).length;

  const starts = loggedPeriodStarts().slice(-7); // up to 7 starts -> 6 lengths
  const lens = [];
  for (let i = 1; i < starts.length; i++) lens.push(diffDays(parseDate(starts[i - 1]), parseDate(starts[i])));
  const recent = lens.slice(-6).filter(l => l > 0 && l < 90);
  if (recent.length < 2) { els.cycleBars.innerHTML = ''; els.cycleBars.classList.add('hidden'); return; }
  els.cycleBars.classList.remove('hidden');
  const max = Math.max.apply(null, recent);
  els.cycleBars.innerHTML = recent.map(l => {
    const h = Math.max(14, Math.round((l / max) * 62));
    return `<div class="mini-bar" style="height:${h}px"><span>${l}</span></div>`;
  }).join('');
}


// beautiful explainer card for a tapped home row.
function openPhasePopup(kind) {
  const T = t();
  const w = cycleWindows();
  const P = T.phasePopup && T.phasePopup[kind];
  if (!w || !P) return;
  const ic = { period: 'period', fertile: 'fertile', ovulation: 'ovulation', next: 'calendar' };
  const conf = {
    period:   { icon: 'period', cls: 'ico-period',  title: T.lblCardPeriod,
                date: `${fmtShort(w.pStart)} – ${fmtShort(w.pEnd)}`,
                desc: P.desc.replace('{range}', `${fmtShort(w.pStart)} – ${fmtShort(w.pEnd)}`).replace('{n}', w.pDays) },
    fertile:  { icon: 'fertile', cls: 'ico-fertile', title: T.lblCardFertile,
                date: `${fmtShort(w.fStart)} – ${fmtShort(w.fEnd)}`,
                desc: P.desc.replace('{range}', `${fmtShort(w.fStart)} – ${fmtShort(w.fEnd)}`).replace('{n}', w.fDays) },
    ovulation:{ icon: 'ovulation', cls: 'ico-ovu',     title: T.lblCardOvulation,
                date: fmtShort(w.ovu),
                desc: P.desc.replace('{date}', fmtShort(w.ovu)) },
    next:     { icon: 'calendar', cls: 'ico-next',    title: T.lblCardNext,
                date: fmtShort(w.nxt),
                desc: P.desc.replace('{date}', fmtShort(w.nxt)).replace('{left}', T.daysLeft(w.left)) }
  }[kind];
  if (!conf) return;
  els.phaseIco.innerHTML = icon3d(conf.icon, conf.icon === 'period' ? 'tint-red' : '');
  els.phaseIco.className = 'row-ico ' + conf.cls;
  els.phaseTitle.textContent = conf.title;
  els.phaseDate.textContent = conf.date;
  els.phaseDesc.textContent = conf.desc;
  els.phaseTips.innerHTML = (P.tips || []).map(x => `<li>${esc(x)}</li>`).join('');
  els.phaseModal.classList.remove('hidden');
}

function closePhasePopup() {
  els.phaseModal.classList.add('hidden');
}

function checkAlarm(daysLeft) {
  const T = t();
  const { notify, notifyDays } = state.data;

  if (!notify || daysLeft <= 0 || daysLeft > notifyDays) {
    els.alarm.classList.add('hidden');
    return;
  }
  const msg = T.alarmText(daysLeft);
  els.alarmText.textContent = msg;
  els.alarm.classList.remove('hidden');

  const key = `${toKey(today())}-${daysLeft}`;
  if (localStorage.getItem(LS.notified) === key) return;
  localStorage.setItem(LS.notified, key);
  notifyUser(T.alarmTitle, msg, 'aura-period');
}

function celebrateCycleStart(start) {
  if (!isSameDay(start, today())) return;
  const key = toKey(start);
  if (localStorage.getItem(LS.cycleSeen) === key) return;
  localStorage.setItem(LS.cycleSeen, key);
  setTimeout(() => toast(t().msgCycleStart, 'ok'), 400);
}

// ---------- calendar ----------
const ICONS = {
  period: `<svg fill="#fb7185" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  fertile: `<svg fill="#a855f7" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 10.59l3.3 3.3-1.42 1.42L11 13V7h2z"/></svg>`,
  ovulation: `<svg fill="#d97706" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>`,
  next: `<svg fill="#0284c7" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>`
};

function renderCalendar() {
  const T = t();
  const y = state.viewDate.getFullYear();
  const m = state.viewDate.getMonth();

  els.calTitle.textContent = `${T.months[m]} ${y}`;
  els.calDays.innerHTML = '';

  const firstWeekday = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'day empty';
    els.calDays.appendChild(spacer);
  }

  for (let d = 1; d <= total; d++) {
    const date = new Date(y, m, d);
    const key = toKey(date);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    btn.innerHTML = `<span>${d}</span>`;

    const info = cycleInfoFor(date);
    if (info) {
      if (date >= info.start && date <= info.periodEnd) {
        btn.classList.add('is-period');
        btn.innerHTML += ICONS.period;
      } else if (isSameDay(date, info.ovulation)) {
        btn.classList.add('is-ovulation');
        btn.innerHTML += ICONS.ovulation;
      } else if (date >= info.fertileStart && date <= info.fertileEnd) {
        btn.classList.add('is-fertile');
        btn.innerHTML += ICONS.fertile;
      } else if (isSameDay(date, info.nextStart)) {
        btn.classList.add('is-next');
        btn.innerHTML += ICONS.next;
      }
    }

    if (isSameDay(date, today())) btn.classList.add('is-today');

    const entry = state.logs[key];
    if (entry && (entry.flow || (entry.symptoms && entry.symptoms.length) || entry.mood || entry.notes)) {
      const dot = document.createElement('span');
      dot.className = 'logged';
      btn.appendChild(dot);
    }

    btn.addEventListener('click', () => openLogModal(key));
    els.calDays.appendChild(btn);
  }
}

// ---------- history ----------
function rebuildMonthFilter() {
  const T = t();
  const months = new Set();
  Object.keys(state.logs).forEach(k => months.add(k.slice(0, 7)));

  const sorted = [...months].sort().reverse();
  els.monthFilter.innerHTML = `<option value="all">${T.allMonths}</option>`;
  for (const ym of sorted) {
    const [y, m] = ym.split('-').map(Number);
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = `${T.months[m - 1]} ${y}`;
    els.monthFilter.appendChild(opt);
  }
  const stillThere = [...els.monthFilter.options].some(o => o.value === state.historyMonth);
  if (!stillThere) state.historyMonth = 'all';
  els.monthFilter.value = state.historyMonth;
}

function matchesSearch(entry, q) {
  if (!q) return true;
  const T = t();
  const s = q.toLowerCase();

  if (entry.notes && entry.notes.toLowerCase().includes(s)) return true;
  if (entry.flow && (T.flows[entry.flow] || '').toLowerCase().includes(s)) return true;
  if (entry.mood && (T.moods[entry.mood] || '').toLowerCase().includes(s)) return true;
  if (entry.symptoms) {
    for (const sym of entry.symptoms) {
      if ((T.chips[sym] || '').toLowerCase().includes(s)) return true;
      if ((T.advices[sym] || '').toLowerCase().includes(s)) return true;
    }
  }
  return false;
}

function prettyDate(key) {
  const d = parseDate(key);
  const T = t();
  return `${T.weekdays[d.getDay()]}, ${d.getDate()} ${T.months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderHistory() {
  const T = t();
  rebuildMonthFilter();

  let keys = Object.keys(state.logs).sort().reverse();
  if (state.historyMonth !== 'all') {
    keys = keys.filter(k => k.startsWith(state.historyMonth));
  }
  if (state.historySearch) {
    keys = keys.filter(k => matchesSearch(state.logs[k], state.historySearch));
  }

  els.historyList.innerHTML = '';

  if (!keys.length) {
    els.historyList.innerHTML = `
      <div class="empty-state">
        <div class="ico">🌸</div>
        <div>${T.noLogs}</div>
      </div>`;
    return;
  }

  for (const date of keys) {
    const entry = state.logs[date];
    const card = document.createElement('div');
    card.className = 'log-card';

    const flowText = entry.flow && T.flows[entry.flow] ? T.flows[entry.flow] : '';
    const moodText = entry.mood && T.moods[entry.mood] ? T.moods[entry.mood] : '';
    const tags = (entry.symptoms || [])
      .map(s => `<span class="tag">${esc(T.chips[s] || s)}</span>`).join('');
    const moodTag = moodText ? `<span class="tag mood-tag">${esc(moodText)}</span>` : '';

    card.innerHTML = `
      <div class="log-head">
        <div class="log-date">${prettyDate(date)}</div>
        ${flowText ? `<span class="flow-tag">${flowText}</span>` : ''}
      </div>
      ${(tags || moodTag) ? `<div class="tags">${moodTag}${tags}</div>` : ''}
      ${entry.notes ? `<div class="notes">${esc(entry.notes)}</div>` : ''}
      ${adviceDetailsHTML(entry.symptoms)}
    `;

    card.addEventListener('click', (e) => { if (e.target.closest('details')) return; openLogModal(date); });
    els.historyList.appendChild(card);
  }
}

// ---------- insights ----------
function renderInsights() {
  const T = t();
  const info = cycleInfoFor(today());
  const C = 2 * Math.PI * 60; // hero ring circumference

  if (info) {
    const day = Math.max(1, diffDays(info.start, today()) + 1);
    const left = diffDays(today(), info.nextStart);
    const cycLen = state.data.cycleLength || 28;
    els.statDay.textContent = day;
    els.statCycle.textContent = cycLen;
    els.statPeriod.textContent = state.data.periodLength;
    els.statLeft.textContent = left <= 0 ? T.daysLeft(0) : left;
    // hero ring
    els.insRingDay.textContent = day;
    els.insRingProg.style.strokeDasharray = `${Math.min(day / cycLen, 1) * C} ${C}`;
    els.insHeroSub.textContent = `${T.dayOfCycle(day)} · ${T.daysLeft(Math.max(left, 0))}`;
  } else {
    els.statDay.textContent = '—';
    els.statCycle.textContent = state.data.cycleLength;
    els.statPeriod.textContent = state.data.periodLength;
    els.statLeft.textContent = '—';
    els.insRingDay.textContent = '—';
    els.insRingProg.style.strokeDasharray = `0 ${C}`;
    els.insHeroSub.textContent = '';
  }

  els.predictions.innerHTML = '';
  const preds = upcomingPeriods(today(), 3);
  if (!preds.length) {
    els.predictions.innerHTML = `<div class="card pred-card"><div class="sub-text">${T.noData}</div></div>`;
  } else {
    preds.forEach(p => {
      const away = diffDays(today(), p);
      const card = document.createElement('div');
      card.className = 'card pred-card';
      card.innerHTML = `
        <span class="tile t-blue">${icon3d('calendar')}</span>
        <div class="pred-info">
          <div class="pred-date">${fmtShort(p)}</div>
          <div class="pred-in">${T.predDays(away)}</div>
        </div>`;
      els.predictions.appendChild(card);
    });
  }

  const symCounts = {};
  const flowCounts = {};
  const moodCounts = {};
  for (const key in state.logs) {
    const e = state.logs[key];
    (e.symptoms || []).forEach(s => symCounts[s] = (symCounts[s] || 0) + 1);
    if (e.flow) flowCounts[e.flow] = (flowCounts[e.flow] || 0) + 1;
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  }
  drawBars(els.symChart, symCounts, k => T.chips[k] || k);
  drawDonut(els.flowDonut, els.flowLegend, flowCounts, k => T.flows[k] || k, {
    spotting: '#cbd5e1', light: '#f9a8d4', medium: '#f472b6', heavy: '#e11d48'
  });
  const moodOrder = ['great', 'good', 'okay', 'low', 'bad'];
  const orderedMoods = {};
  moodOrder.forEach(k => { if (moodCounts[k]) orderedMoods[k] = moodCounts[k]; });
  Object.keys(moodCounts).forEach(k => { if (!(k in orderedMoods)) orderedMoods[k] = moodCounts[k]; });
  if (els.moodChart) {
    if (Object.keys(orderedMoods).length) {
      els.moodInsight.classList.remove('hidden');
      drawBars(els.moodChart, orderedMoods, k => T.moods[k] || k);
    } else {
      els.moodInsight.classList.add('hidden');
    }
  }

  const total = Object.keys(state.logs).length;
  const monthPrefix = toKey(today()).slice(0, 7);
  const monthCount = Object.keys(state.logs).filter(k => k.startsWith(monthPrefix)).length;
  els.statTotal.textContent = total;
  els.statMonth.textContent = monthCount;
}

function drawBars(container, counts, labelFn) {
  container.innerHTML = '';
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (!rows.length) {
    container.innerHTML = `<div class="sub-text">${t().noData}</div>`;
    return;
  }
  const max = rows[0][1];
  for (const [key, n] of rows) {
    const pct = Math.round((n / max) * 100);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-head"><span>${esc(labelFn(key))}</span><span class="n">${n}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
    container.appendChild(row);
  }
}

// premium donut chart: colored ring segments + total in the middle + legend
function drawDonut(svg, legendEl, counts, labelFn, colorMap) {
  const T = t();
  const entries = Object.entries(counts).filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, n]) => s + n, 0);
  if (!total) {
    svg.innerHTML = '';
    legendEl.innerHTML = `<div class="sub-text">${T.noData}</div>`;
    return;
  }
  const R = 46, CX = 60, CY = 60, C = 2 * Math.PI * R;
  let acc = 0;
  svg.innerHTML = entries.map(([k, n]) => {
    const len = (n / total) * C;
    const seg = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" ` +
      `stroke="${colorMap[k] || '#cbd5e1'}" stroke-width="20" ` +
      `stroke-dasharray="${Math.max(len - 2.5, 1).toFixed(1)} ${C.toFixed(1)}" ` +
      `stroke-dashoffset="${(-acc).toFixed(1)}" stroke-linecap="round" ` +
      `transform="rotate(-90 ${CX} ${CY})"/>`;
    acc += len;
    return seg;
  }).join('') +
    `<text x="${CX}" y="${CY - 2}" text-anchor="middle" class="donut-num">${total}</text>` +
    `<text x="${CX}" y="${CY + 18}" text-anchor="middle" class="donut-lbl">${esc(T.lblStatTotalLogs)}</text>`;
  legendEl.innerHTML = entries.map(([k, n]) =>
    `<div class="legend-row"><span class="dot" style="background:${colorMap[k] || '#cbd5e1'}"></span>` +
    `<span>${esc(labelFn(k))}</span><b>${n}</b></div>`
  ).join('');
}

// ---------- log modal ----------
function openLogModal(key) {
  const T = t();
  state.selectedDate = key;

  const date = parseDate(key);
  els.logDate.textContent = prettyDate(key);

  const phase = phaseFor(date);
  els.logPhase.className = 'phase-chip' + (phase ? ' phase-' + phase : '');
  els.logPhase.textContent = phaseLabel(phase);
  els.logPhase.classList.toggle('hidden', !phase);

  const entry = state.logs[key] || { flow: null, symptoms: [], mood: null, notes: '' };
  const syms = entry.symptoms || [];

  const syncChips = (row, isActive) => {
    row.querySelectorAll('.chip').forEach(c => {
      const on = isActive(c);
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };
  syncChips(els.logFlowRow, c => c.dataset.flow === entry.flow);
  syncChips(els.logSymRow, c => syms.includes(c.dataset.sym));
  syncChips(els.logMoodRow, c => c.dataset.mood === entry.mood);
  els.logNotes.value = entry.notes || '';

  const hasData = !!(entry.flow || syms.length || entry.mood || (entry.notes && entry.notes.trim()));
  els.logDelete.classList.toggle('hidden', !hasData);

  refreshAdvicePreview();
  openModal(els.logModal);
}

function closeLogModal() {
  closeModal(els.logModal);
  state.selectedDate = null;
}

function refreshAdvicePreview() {
  const active = [...els.logSymRow.querySelectorAll('.chip.active')]
    .map(c => c.dataset.sym);

  if (!active.length) {
    els.adviceBox.classList.add('hidden');
    return;
  }
  els.adviceList.innerHTML = adviceHTML(active, false);
  els.adviceBox.classList.remove('hidden');
}

// ---------- settings form ----------
function fillSettingsForm() {
  els.setName.value = state.data.userName || '';
  els.setLast.value = state.data.lastDate || '';
  els.setCycle.value = state.data.cycleLength;
  els.setPeriod.value = state.data.periodLength;
  els.setLuteal.value = state.data.lutealPhase;
  els.setNotify.checked = !!state.data.notify;
  els.setNotifyDays.value = String(state.data.notifyDays);
  els.setBot.checked = state.data.showBot !== false; // old saves don't have the key yet
  els.setRemindLog.checked = !!state.data.logReminder;
  els.setRemindTime.value = state.data.logReminderTime || '21:00';
  els.setWellness.checked = state.data.wellnessNudges !== false;
  els.setBotName.value = state.data.botName || '';
  els.setAge.value = state.data.age || '';
  els.setWeight.value = state.data.weightKg || '';
  els.setHeight.value = state.data.heightCm || '';
  updateNotifStatus();
}

// ---------- master ----------
function renderAll() {
  renderTodayPill();
  renderHeader();
  renderStats();
  renderSummary();
  renderCalendar();
  renderHistory();
  renderInsights();
}