// Rendering. Reads state, writes DOM. No event listeners.

const els = {
  appTitle: $('app-title'),
  appSubtitle: $('app-subtitle'),
  sideTitle: $('side-title'),
  sideSubtitle: $('side-subtitle'),
  langSelect: $('lang-select'),
  langSelectDesktop: $('lang-select-desktop'),
  themeToggle: $('theme-toggle'),
  themeToggleDesktop: $('theme-toggle-desktop'),

  alarm: $('alarm-banner'),
  alarmText: $('alarm-text'),

  pill: $('today-pill'),
  pillText: $('pill-text'),

  hero: $('hero'),
  heroDay: $('hero-day'),
  heroStatus: $('hero-status'),
  heroProgress: $('hero-progress'),

  badgePeriod: $('badge-period'),
  badgeFertile: $('badge-fertile'),
  badgeOvulation: $('badge-ovulation'),
  badgeNext: $('badge-next'),
  valPeriod: $('val-period'),
  valFertile: $('val-fertile'),
  valOvulation: $('val-ovulation'),
  valNext: $('val-next'),

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
  predictions: $('predictions'),
  symChart: $('sym-chart'),
  flowChart: $('flow-chart'),
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
    if (T[key]) el.textContent = T[key];
  });

  const name = state.data.userName ? state.data.userName + ' ' : 'Aura ';
  els.appTitle.textContent = name + (state.lang === 'my' ? 'မှတ်တမ်း' : 'Tracker');
  els.sideTitle.textContent = state.data.userName || 'Aura';
  els.sideSubtitle.textContent = T.appSubtitle;
  els.appSubtitle.textContent = T.appSubtitle;

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

  els.langSelect.value = state.lang;
  els.langSelectDesktop.value = state.lang;
  document.documentElement.lang = state.lang;
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const icon = state.theme === 'dark' ? '☀️' : '🌙';
  els.themeToggle.textContent = icon;
  els.themeToggleDesktop.textContent = icon;
  localStorage.setItem(LS.theme, state.theme);
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

  return `<details class="advice-details"><summary>${esc(T.lblAdviceHeading)} (${items.length})</summary><ul class="advice-list">${items.join('')}</ul></details>`;
}

// ---------- home ----------
function renderTodayPill() {
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

function renderHero() {
  const info = cycleInfoFor(today());

  if (!info) {
    els.heroDay.textContent = '—';
    els.heroStatus.textContent = '—';
    els.heroProgress.style.width = '0%';
    return;
  }

  const day = Math.max(1, diffDays(info.start, today()) + 1);
  els.heroDay.textContent = day;

  const phase = phaseFor(today());
  els.heroStatus.textContent = phaseLabel(phase);
  els.hero.className = 'cycle-card phase-' + phase;

  const pct = Math.min(100, Math.max(0, ((day - 1) / state.data.cycleLength) * 100));
  els.heroProgress.style.width = pct + '%';
}

function renderCards() {
  const T = t();
  const info = cycleInfoFor(today());
  if (!info) {
    els.badgePeriod.textContent = '—';
    els.badgeFertile.textContent = '—';
    els.badgeOvulation.textContent = '—';
    els.badgeNext.textContent = '—';
    els.valPeriod.textContent = '—';
    els.valFertile.textContent = '—';
    els.valOvulation.textContent = '—';
    els.valNext.textContent = '—';
    return;
  }

  let pStart = info.start, pEnd = info.periodEnd;
  let fStart = info.fertileStart, fEnd = info.fertileEnd;
  let ovu = info.ovulation;
  const nxt = info.nextStart;

  if (today() > info.periodEnd) {
    pStart = info.nextStart;
    pEnd = addDays(info.nextStart, state.data.periodLength - 1);
  }
  if (today() > info.fertileEnd) {
    const nextInfo = cycleInfoFor(addDays(info.start, state.data.cycleLength));
    fStart = nextInfo.fertileStart;
    fEnd = nextInfo.fertileEnd;
    ovu = nextInfo.ovulation;
  }

  els.badgePeriod.textContent = `${state.data.periodLength} ${T.daysUnit}`;
  els.valPeriod.textContent = `${fmtShort(pStart)} – ${fmtShort(pEnd)}`;

  const fDays = diffDays(fStart, fEnd) + 1;
  els.badgeFertile.textContent = `${fDays} ${T.daysUnit}`;
  els.valFertile.textContent = `${fmtShort(fStart)} – ${fmtShort(fEnd)}`;

  els.badgeOvulation.textContent = T.peak;
  els.valOvulation.textContent = fmtShort(ovu);

  const left = diffDays(today(), nxt);
  els.badgeNext.textContent = T.daysLeft(left);
  els.valNext.textContent = fmtShort(nxt);

  checkAlarm(left);
  celebrateCycleStart(info.start);
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
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(T.alarmTitle, { body: msg }); } catch (_) { }
  }
  localStorage.setItem(LS.notified, key);
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

  if (info) {
    const day = Math.max(1, diffDays(info.start, today()) + 1);
    const left = diffDays(today(), info.nextStart);
    els.statDay.textContent = day;
    els.statCycle.textContent = state.data.cycleLength;
    els.statPeriod.textContent = state.data.periodLength;
    els.statLeft.textContent = left <= 0 ? T.daysLeft(0) : left;
  } else {
    els.statDay.textContent = '—';
    els.statCycle.textContent = state.data.cycleLength;
    els.statPeriod.textContent = state.data.periodLength;
    els.statLeft.textContent = '—';
  }

  els.predictions.innerHTML = '';
  const preds = upcomingPeriods(today(), 3);
  if (!preds.length) {
    els.predictions.innerHTML = `<li style="border-left-color:var(--faint)">${T.noData}</li>`;
  } else {
    preds.forEach((p, i) => {
      const away = diffDays(today(), p);
      const li = document.createElement('li');
      li.className = 'c' + (i + 1);
      li.innerHTML = `
        <span>${fmtShort(p)}</span>
        <span class="p-in">${T.predDays(away)}</span>`;
      els.predictions.appendChild(li);
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
  drawBars(els.flowChart, flowCounts, k => T.flows[k] || k);
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
}

// ---------- master ----------
function renderAll() {
  renderTodayPill();
  renderHero();
  renderCards();
  renderCalendar();
  renderHistory();
  renderInsights();
}