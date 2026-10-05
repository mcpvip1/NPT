// Wiring. All event listeners live here.

function switchTab(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name).classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  currentTab = name;
  renderHeader();
  if (name === 'tab-advice') {
    renderAdvicePage();
  }
  if (name === 'tab-insights') {
    renderInsights();
    animateInsightsHero();
  }
  if (name === 'tab-home') {
    animateHomeStats();
  }
}

function initTabs() {
  // one binding for every tab jump: bottom nav, sidebar, quick cards, avatar, links
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function initCalendarNav() {
  els.calPrev.addEventListener('click', () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1);
    renderCalendar();
  });
  els.calNext.addEventListener('click', () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  // swipe on calendar
  let x0 = 0, y0 = 0;
  els.calDays.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });
  els.calDays.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) els.calPrev.click(); else els.calNext.click();
    }
  }, { passive: true });
}

function initLogModal() {
  els.logFlowRow.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const wasActive = chip.classList.contains('active');
    els.logFlowRow.querySelectorAll('.chip').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    if (!wasActive) {
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
    }
  });

  els.logSymRow.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('active');
    chip.setAttribute('aria-pressed', chip.classList.contains('active'));
    refreshAdvicePreview();
  });

  els.logMoodRow.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const wasActive = chip.classList.contains('active');
    els.logMoodRow.querySelectorAll('.chip').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    if (!wasActive) {
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
    }
  });

  els.logClose.addEventListener('click', closeLogModal);
  els.logModal.addEventListener('click', e => {
    if (e.target === els.logModal) closeLogModal();
  });

  // read the modal, persist it, re-render. returns the entry (or null on failure).
  function persistLogModal() {
    const key = state.selectedDate;
    if (!key) return null;
    const flowChip = els.logFlowRow.querySelector('.chip.active');
    const flow = flowChip ? flowChip.dataset.flow : null;
    const symptoms = [...els.logSymRow.querySelectorAll('.chip.active')].map(c => c.dataset.sym);
    const moodChip = els.logMoodRow.querySelector('.chip.active');
    const mood = moodChip ? moodChip.dataset.mood : null;
    const notes = els.logNotes.value.trim();

    const entry = { key, flow, symptoms, mood, notes };
    if (flow || symptoms.length || mood || notes) {
      state.logs[key] = { flow, symptoms, mood, notes };
    } else {
      delete state.logs[key];
    }
    if (!saveLogs()) {
      toast(t().msgSaveError || 'Save failed', 'err');
      return null;
    }

    renderCalendar();
    renderHistory();
    renderInsights();
    return entry;
  }

  els.logSave.addEventListener('click', () => {
    if (!persistLogModal()) return;
    closeLogModal();
    toast(t().msgSaved, 'ok');
  });

  // save, then jump to the advice tab with advice based on this exact entry.
  els.logAdvice.addEventListener('click', () => {
    const entry = persistLogModal();
    if (!entry) return;
    closeLogModal();
    state.adviceFocus = entry;
    switchTab('tab-advice');
  });

  els.logDelete.addEventListener('click', async () => {
    const key = state.selectedDate;
    if (!key) return;
    const T = t();
    const ok = await askConfirm(T.confirmDeleteTitle, T.confirmDeleteMsg);
    if (!ok) return;
    delete state.logs[key];
    saveLogs();
    renderCalendar();
    renderHistory();
    renderInsights();
    closeLogModal();
    toast(T.msgDeleted, 'ok');
  });
}

function initConfirm() {
  els.confirmCancel.addEventListener('click', () => closeConfirm(false));
  els.confirmOk.addEventListener('click', () => closeConfirm(true));
  els.confirmModal.addEventListener('click', e => {
    if (e.target === els.confirmModal) closeConfirm(false);
  });
}

function initSettings() {
  els.form.addEventListener('submit', e => {
    e.preventDefault();
    const T = t();

    state.data.userName = els.setName.value.trim();
    state.data.lastDate = els.setLast.value;
    state.data.cycleLength = clamp(parseInt(els.setCycle.value, 10), 15, 90, 28);
    state.data.periodLength = clamp(parseInt(els.setPeriod.value, 10), 1, 15, 5);
    state.data.lutealPhase = clamp(parseInt(els.setLuteal.value, 10), 8, 20, 14);
    state.data.notify = els.setNotify.checked;
    state.data.notifyDays = parseInt(els.setNotifyDays.value, 10);
    state.data.showBot = els.setBot.checked;
    state.data.logReminder = els.setRemindLog.checked;
    state.data.logReminderTime = els.setRemindTime.value || '21:00';
    state.data.wellnessNudges = els.setWellness.checked;
    state.data.botName = els.setBotName.value.trim().slice(0, 24) || 'Aura';
    state.data.age = numOrNull(els.setAge.value, 9, 100);
    state.data.weightKg = numOrNull(els.setWeight.value, 20, 300);
    state.data.heightCm = numOrNull(els.setHeight.value, 80, 250);

    if (state.data.logReminder && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (state.data.notify && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (!saveData()) {
      toast(T.msgSaveError || 'Save failed', 'err');
      return;
    }
    applyLang();
    renderAll();
    toast(T.msgSaved, 'ok');
  });

  $('btn-export').addEventListener('click', () => {
    const T = t();
    const payload = {
      data: state.data, logs: state.logs,
      version: 3, exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-${toKey(today())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast(T.msgExported, 'ok');
  });

  $('btn-import').addEventListener('click', () => {
    els.importText.value = '';
    openModal(els.importModal);
  });
  els.importClose.addEventListener('click', () => closeModal(els.importModal));
  els.importModal.addEventListener('click', e => {
    if (e.target === els.importModal) closeModal(els.importModal);
  });
  els.importGo.addEventListener('click', () => {
    const T = t();
    const raw = els.importText.value.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') throw new Error('bad import');

      // Build into temp objects first — state is only replaced when everything validates.
      let nextData = null;
      let nextLogs = null;

      if (parsed.data && typeof parsed.data === 'object') {
        const d = parsed.data;
        const lastDate = typeof d.lastDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.lastDate) && parseDate(d.lastDate) ? d.lastDate : '';
        nextData = {
          ...DEFAULTS,
          userName: typeof d.userName === 'string' ? d.userName.slice(0, 60) : '',
          lastDate,
          cycleLength: clamp(parseInt(d.cycleLength, 10), 15, 90, 28),
          periodLength: clamp(parseInt(d.periodLength, 10), 1, 15, 5),
          lutealPhase: clamp(parseInt(d.lutealPhase, 10), 8, 20, 14),
          notify: !!d.notify,
          notifyDays: clamp(parseInt(d.notifyDays, 10), 1, 30, 2),
          showBot: d.showBot !== false,
          logReminder: !!d.logReminder,
          logReminderTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(d.logReminderTime || '') ? d.logReminderTime : '21:00',
          wellnessNudges: d.wellnessNudges !== false,
          nudgePrefs: (d.nudgePrefs && typeof d.nudgePrefs === 'object' && !Array.isArray(d.nudgePrefs)) ? d.nudgePrefs : {},
          botName: typeof d.botName === 'string' && d.botName.trim() ? d.botName.trim().slice(0, 24) : 'Aura',
          age: numOrNull(d.age, 9, 100),
          weightKg: numOrNull(d.weightKg, 20, 300),
          heightCm: numOrNull(d.heightCm, 80, 250),
          country: d.country === 'th' ? 'th' : 'mm'
        };
      }
      if (parsed.logs && typeof parsed.logs === 'object') {
        nextLogs = {};
        for (const k in parsed.logs) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
          const entry = sanitizeLogEntry(parsed.logs[k]);
          if (entry) nextLogs[k] = entry;
        }
      }

      if (nextData) state.data = nextData;
      if (nextLogs) state.logs = nextLogs;
      if (!saveData() || !saveLogs()) {
        toast(T.msgSaveError || 'Save failed', 'err');
        return;
      }
      fillSettingsForm();
      applyLang();
      renderAll();
      closeModal(els.importModal);
      toast(T.msgImported, 'ok');
    } catch (_) {
      toast(T.msgImportError, 'err');
    }
  });

  $('btn-reset').addEventListener('click', async () => {
    const T = t();
    const ok = await askConfirm(T.confirmResetTitle, T.confirmResetMsg);
    if (!ok) return;
    localStorage.removeItem(LS.data);
    localStorage.removeItem(LS.logs);
    localStorage.removeItem(LS.notified);
    localStorage.removeItem(LS.cycleSeen);
    state.data = { ...DEFAULTS };
    state.logs = {};
    fillSettingsForm();
    applyLang();
    renderAll();
    wizOpen();
    toast(T.msgDeleted, 'ok');
  });
}

// ---- welcome wizard ------------------------------------------------------
// 5 steps: language -> country (IP auto-detected) -> profile -> what the
// app can do -> notifications + home-screen install.
let wizStep = 1;
const WIZ_STEPS = 5;
let wizCountry = 'mm';
let wizCountryDetected = false;
let deferredInstallPrompt = null;

function wizShow(n) {
  wizStep = Math.min(Math.max(n, 1), WIZ_STEPS);
  document.querySelectorAll('.wiz-step').forEach(s =>
    s.classList.toggle('hidden', +s.dataset.step !== wizStep));
  const dots = $('wiz-dots');
  dots.innerHTML = '';
  for (let i = 1; i <= WIZ_STEPS; i++) {
    const d = document.createElement('span');
    d.className = 'wiz-dot' + (i === wizStep ? ' active' : '') + (i < wizStep ? ' done' : '');
    dots.appendChild(d);
  }
  const T = t();
  $('wiz-stepof').textContent = T.wizStepOf(wizStep, WIZ_STEPS);
  $('wiz-back').style.visibility = wizStep === 1 ? 'hidden' : 'visible';
  // last step: the next button becomes the finish button
  $('wiz-next').dataset.lbl = wizStep === WIZ_STEPS ? 'btnDone' : 'btnNext';
  applyLang();
}

function wizMarkActive(containerSel, attr, val) {
  document.querySelectorAll(containerSel + ' [' + attr + ']').forEach(b =>
    b.classList.toggle('active', b.getAttribute(attr) === val));
}

// Best-effort country guess from the user's IP. Offline or blocked -> 'mm'.
async function detectCountry() {
  try {
    const c = new AbortController();
    const timer = setTimeout(() => c.abort(), 5000);
    const r = await fetch('https://ipapi.co/country_code/', { signal: c.signal, cache: 'no-store' });
    clearTimeout(timer);
    if (!r.ok) return 'mm';
    const code = (await r.text()).trim().toUpperCase();
    return code === 'TH' ? 'th' : 'mm';
  } catch (e) {
    return 'mm';
  }
}

function wizOpen() {
  wizCountry = state.data.country === 'th' ? 'th' : 'mm';
  wizCountryDetected = false;
  wizMarkActive('#wiz-lang-opts', 'data-lang-val', state.lang);
  wizMarkActive('#wiz-country-opts', 'data-country-val', wizCountry);
  $('wiz-country-auto').classList.add('hidden');
  $('wiz-notif-status').classList.add('hidden');
  $('wiz-install-status').classList.add('hidden');
  openModal(els.welcome);
  wizShow(1);
  // detect in the background; when it lands, pre-select + say so
  detectCountry().then(cc => {
    wizCountry = cc;
    wizCountryDetected = true;
    state.data.country = cc;
    wizMarkActive('#wiz-country-opts', 'data-country-val', cc);
    $('wiz-country-auto').classList.remove('hidden');
  });
}

function wizFinish() {
  const T = t();
  const name = $('w-name').value.trim();
  const last = $('w-last').value;
  if (!name || !last) {
    wizShow(3);
    (!name ? $('w-name') : $('w-last')).focus();
    toast(T.msgFillRequired || 'Please fill the required fields', 'err');
    return;
  }
  state.data.userName = name;
  state.data.lastDate = last;
  state.data.cycleLength = clamp(parseInt($('w-cycle').value, 10), 15, 90, 28);
  state.data.periodLength = clamp(parseInt($('w-period').value, 10), 1, 15, 5);
  state.data.lutealPhase = 14;
  state.data.country = wizCountry;
  state.data.age = numOrNull($('w-age').value, 9, 100);
  state.data.weightKg = numOrNull($('w-weight').value, 20, 300);
  state.data.heightCm = numOrNull($('w-height').value, 80, 250);

  saveData();
  closeModal(els.welcome);
  fillSettingsForm();
  applyLang();
  renderAll();
  renderBotHello(); // greet the new user right away
  maybeShowInstallNudge();
  toast(t().msgSaved, 'ok');
}

function initWelcome() {
  // step 1: language
  document.querySelectorAll('#wiz-lang-opts [data-lang-val]').forEach(b =>
    b.addEventListener('click', () => {
      setLang(b.dataset.langVal);
      wizMarkActive('#wiz-lang-opts', 'data-lang-val', state.lang);
      setTimeout(() => { if (wizStep === 1) wizShow(2); }, 280);
    }));

  // step 2: country
  document.querySelectorAll('#wiz-country-opts [data-country-val]').forEach(b =>
    b.addEventListener('click', () => {
      wizCountry = b.dataset.countryVal;
      state.data.country = wizCountry;
      wizMarkActive('#wiz-country-opts', 'data-country-val', wizCountry);
      setTimeout(() => { if (wizStep === 2) wizShow(3); }, 280);
    }));

  // step 3: enter key moves forward instead of submitting nowhere
  els.welcomeForm.addEventListener('submit', e => {
    e.preventDefault();
    if (wizStep === 3) wizShow(4);
  });

  // step 5: notifications
  $('wiz-notif-btn').addEventListener('click', async () => {
    const T = t();
    const st = $('wiz-notif-status');
    st.classList.remove('hidden');
    if (!('Notification' in window)) { st.textContent = T.notifDenied; return; }
    if (Notification.permission === 'granted') {
      state.data.notify = true;
      st.textContent = T.notifGranted;
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      state.data.notify = perm === 'granted';
      st.textContent = perm === 'granted' ? T.notifGranted : T.notifDenied;
    } catch (e) {
      st.textContent = T.notifDenied;
    }
  });

  // step 5: add to home screen
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
  $('wiz-install-btn').addEventListener('click', async () => {
    const T = t();
    const st = $('wiz-install-status');
    st.classList.remove('hidden');
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      try {
        const choice = await deferredInstallPrompt.userChoice;
        st.textContent = choice && choice.outcome === 'accepted' ? T.installDone : T.installManual;
      } catch (e) {
        st.textContent = T.installManual;
      }
      deferredInstallPrompt = null;
    } else {
      st.textContent = T.installManual;
    }
  });

  // nav
  $('wiz-back').addEventListener('click', () => wizShow(wizStep - 1));
  $('wiz-next').addEventListener('click', () => {
    if (wizStep < WIZ_STEPS) wizShow(wizStep + 1);
    else wizFinish();
  });
}

function initLanguage() {
  document.querySelectorAll('#hdr-langseg [data-lang-val]').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.langVal)));
  els.langSelectDesktop.addEventListener('change', e => setLang(e.target.value));
}

function initTheme() {
  els.hdrTheme.addEventListener('click', () =>
    setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  els.themeToggleDesktop.addEventListener('click', () =>
    setTheme(state.theme === 'dark' ? 'light' : 'dark'));
}

function initHistoryControls() {
  els.search.addEventListener('input', e => {
    state.historySearch = e.target.value.trim();
    renderHistory();
  });
  els.monthFilter.addEventListener('change', e => {
    state.historyMonth = e.target.value;
    renderHistory();
  });
}

function initQuickLog() {
  // home: tapping a stat, the banner or a quick card explains that phase in a popup
  document.querySelectorAll('[data-phase]').forEach(b =>
    b.addEventListener('click', () => openPhasePopup(b.dataset.phase)));
  const nl = $('nav-log');
  if (nl) nl.addEventListener('click', () => openLogModal(toKey(today())));

  // Update button in the header: checks GitHub for a newer app version,
  // applies it, shows a message, then refreshes the software.
  const upd = els.hdrUpdate;
  if (upd) upd.addEventListener('click', checkAppUpdate);

  // phase explainer popup close
  els.phaseClose.addEventListener('click', closePhasePopup);
  els.phaseModal.addEventListener('click', e => {
    if (e.target === els.phaseModal) closePhasePopup();
  });
}

function checkLogReminder() {
  const { logReminder, logReminderTime } = state.data;
  if (!logReminder || !logReminderTime) return;
  const now = new Date();
  const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  // "HH:MM" sorts chronologically, so >= means "the time has come (or passed)"
  if (hm < logReminderTime) return;
  const key = toKey(now);
  if (localStorage.getItem(LS.reminded) === key) return; // already nudged today
  if (state.logs[key]) return; // already logged, nothing to nag about
  localStorage.setItem(LS.reminded, key);

  const T = t();
  notifyUser(T.notifLogTitle, T.notifLogBody, 'aura-reminder');
}

function initReminders() {
  checkLogReminder();
  setInterval(checkLogReminder, 60000); // close enough to the minute
}

function initServiceWorker() {
  // needs http(s) — opening the file directly can't do workers, and that's ok
  if (!('serviceWorker' in navigator) || !/^https?:/.test(location.protocol)) return;
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

function initAudioUnlock() {
  // browsers want one real tap before any sound. this arms the chime.
  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
}

// tap the bot anywhere and it boings at you.
function initBotTap() {
  document.addEventListener('click', e => {
    const b = e.target.closest('.bot3d');
    if (!b) return;
    playBoing();
    b.classList.remove('boing');
    void b.offsetWidth; // restart the bounce
    b.classList.add('boing');
  });
}

function initBotHello() {
  els.botHelloClose.addEventListener('click', () => els.botHello.classList.add('hidden'));
}

function initNotifPermission() {
  els.notifPermBtn.addEventListener('click', async () => {
    if ('Notification' in window) {
      try { await Notification.requestPermission(); } catch (_) {}
    }
    updateNotifStatus();
    renderAdvicePage();
  });
}

function initAdvicePage() {
  // "remind me" on an advice card: switches that nudge on and asks for
  // permission right there, so the link between advice and reminder is one tap.
  els.adviceToday.addEventListener('click', async e => {
    const btn = e.target.closest('[data-nudge-remind]');
    if (!btn) return;
    state.data.wellnessNudges = true;
    state.data.nudgePrefs = { ...(state.data.nudgePrefs || {}), [btn.dataset.nudgeRemind]: true };
    if (!saveData()) { toast(t().msgSaveError, 'err'); return; }
    fillSettingsForm();
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (_) {}
    }
    updateNotifStatus();
    renderAdvicePage();
    toast(t().msgRemindOn, 'ok');
  });
  els.advicePermBtn.addEventListener('click', async () => {
    if ('Notification' in window) {
      try { await Notification.requestPermission(); } catch (_) {}
    }
    updateNotifStatus();
    renderAdvicePage();
  });
  // AI health assistant: personal advice from the user's real logs
  if (els.aiAsk) els.aiAsk.addEventListener('click', handleAskAi);
}

// -- AI health assistant -------------------------------------------------------
let _aiBusy = false;
async function handleAskAi() {
  if (_aiBusy) return;
  const T = t();
  _aiBusy = true;
  els.aiAsk.disabled = true;
  els.aiError.classList.add('hidden');
  els.aiResult.classList.add('hidden');
  els.aiLoading.classList.remove('hidden');
  try {
    const { text, provider, ctx } = await askAiAdvice();
    const html = `<div class="ai-country">📍 ${escHtml(ctx.countryName)}</div>` + aiMdToHtml(text);
    setAiCache(html, aiContextHash(ctx), provider);
    els.aiResult.innerHTML = html;
    els.aiResult.classList.remove('hidden');
    els.aiAsk.querySelector('span').textContent = T.aiRefresh;
    els.aiResult.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } catch (e) {
    const code = e && e.code;
    els.aiError.textContent =
      code === 'offline' ? T.aiErrOffline :
      code === 'nokey' ? T.aiErrNoKey :
      T.aiErrFailed;
    els.aiError.classList.remove('hidden');
  } finally {
    els.aiLoading.classList.add('hidden');
    els.aiAsk.disabled = false;
    _aiBusy = false;
  }
}

function initAiSettings() {
  if (!els.aiSave) return;
  const s = aiSettings();
  if (els.geminiKey) els.geminiKey.value = s.geminiKey || '';
  if (els.aiProviderSeg) {
    els.aiProviderSeg.querySelectorAll('[data-ai-provider]').forEach(b =>
      b.classList.toggle('active', b.dataset.aiProvider === s.provider));
    els.aiProviderSeg.addEventListener('click', e => {
      const b = e.target.closest('[data-ai-provider]');
      if (!b) return;
      els.aiProviderSeg.querySelectorAll('[data-ai-provider]').forEach(x =>
        x.classList.toggle('active', x === b));
    });
  }
  els.aiSave.addEventListener('click', () => {
    const active = els.aiProviderSeg && els.aiProviderSeg.querySelector('[data-ai-provider].active');
    saveAiSettings({
      provider: active ? active.dataset.aiProvider : 'auto',
      geminiKey: els.geminiKey ? els.geminiKey.value.trim() : ''
    });
    try { localStorage.removeItem(AI_CACHE_KEY); } catch (e) {}
    toast(t().msgSaved, 'ok');
  });
}

function initInstallNudge() {
  els.installGotit.addEventListener('click', () => {
    localStorage.setItem(LS.installNudge, '1');
    closeModal(els.installNudge);
  });
  els.installNotifBtn.addEventListener('click', async () => {
    if ('Notification' in window) {
      try { await Notification.requestPermission(); } catch (_) {}
    }
    localStorage.setItem(LS.installNudge, '1');
    closeModal(els.installNudge);
    toast(t().installDone, 'ok');
  });
}

function initEscape() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!els.logModal.classList.contains('hidden')) closeLogModal();
    else if (!els.phaseModal.classList.contains('hidden')) closePhasePopup();
    else if (!els.importModal.classList.contains('hidden')) closeModal(els.importModal);
    else if (!els.confirmModal.classList.contains('hidden')) closeConfirm(false);
    else if (els.updCard && !els.updCard.classList.contains('hidden')) hideUpdateCard();
  });
}

// ---- in-app updater ------------------------------------------------------
// The Update button checks the GitHub repo for a newer app version. It
// needs the internet (a popup says so when offline). After a successful
// update it shows a message and refreshes the software.
const APP_VERSION = '851bff64'; // commit this copy was built from
const UPDATE_REPO = 'mcpvip1/NPT';

function seedAppVersion() {
  try {
    if (!localStorage.getItem('aura_app_ver'))
      localStorage.setItem('aura_app_ver', APP_VERSION);
  } catch (e) {}
}

async function checkAppUpdate() {
  const T = t();
  const info = (typeof openInfoPopup === 'function') ? openInfoPopup : (a, b) => alert(a + '\n' + b);
  const btn = els.hdrUpdate;
  if (btn) btn.classList.add('spinning');
  try {
    const online = (typeof hasInternet === 'function') ? await hasInternet() : navigator.onLine !== false;
    if (!online) {
      info(T.updNeedInternetTitle, T.updNeedInternetMsg);
      return;
    }
    const r = await fetch('https://api.github.com/repos/' + UPDATE_REPO + '/commits/main', { cache: 'no-store' });
    if (!r.ok) throw new Error('github api ' + r.status);
    const j = await r.json();
    const sha = String(j.sha || '').slice(0, 8);
    const msg = String((j.commit && j.commit.message) || '').split('\n')[0].slice(0, 140);
    let stored = APP_VERSION;
    try { stored = localStorage.getItem('aura_app_ver') || APP_VERSION; } catch (e) {}
    if (!sha || sha === stored) {
      clearUpdateBadge();
      info(T.updUpToDateTitle, T.updUpToDateMsg(stored));
      return;
    }
    await applyAppUpdate(sha, msg, info);
    clearUpdateBadge();
  } catch (e) {
    info(T.updFailedTitle, T.updFailedMsg);
  } finally {
    if (btn) btn.classList.remove('spinning');
  }
}

async function applyAppUpdate(sha, msg, info) {
  const T = t();
  info = info || ((typeof openInfoPopup === 'function') ? openInfoPopup : (a, b) => alert(a + '\n' + b));
  // a local file:// copy can't pull fresh files by itself — point at GitHub
  if (location.protocol === 'file:') {
    try { localStorage.setItem('aura_app_ver', sha); } catch (e) {}
    info(T.updAvailableTitle, T.updAvailableMsg + (msg ? '\n' + msg : ''));
    return;
  }
  // drop the service worker + caches so the next load fetches fresh files
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) await reg.unregister();
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  } catch (e) {}
  try { localStorage.setItem('aura_app_ver', sha); } catch (e) {}
  info(T.updDoneTitle, T.updDoneMsg(msg), () => location.reload(), T.btnRestart);
  setTimeout(() => { if (!$('info-popup').classList.contains('hidden')) location.reload(); }, 4000);
}

// ---- silent update check on launch ---------------------------------------
// Runs once per app open, a couple of seconds after the UI settles. If a
// newer version exists on GitHub, the Update button grows a pulsing
// notification dot and a toast explains what to do. Never bothers the
// user when offline, up to date, or when the check itself fails.
let _updateCheckDone = false;
let _pendingUpdate = null; // newest commit awaiting install from the what's-new card

// newest commits on main since the stored version (capped, for the changelog).
async function fetchChangelog(sinceShortSha) {
  const r = await fetch(`https://api.github.com/repos/${UPDATE_REPO}/commits?per_page=10`, { cache: 'no-store' });
  if (!r.ok) throw new Error('github api ' + r.status);
  const list = await r.json();
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const c of list) {
    const sha = String(c.sha || '');
    if (sinceShortSha && sha.startsWith(sinceShortSha)) break;
    const msg = String((c.commit && c.commit.message) || '').split('\n')[0].slice(0, 120).trim();
    if (!msg) continue;
    out.push({ sha: sha.slice(0, 8), msg });
    if (out.length >= 5) break;
  }
  return out;
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

async function silentUpdateCheck() {
  if (_updateCheckDone) return;
  _updateCheckDone = true;
  try {
    const online = (typeof hasInternet === 'function') ? await hasInternet(4000) : navigator.onLine !== false;
    if (!online) return;
    let stored = APP_VERSION;
    try { stored = localStorage.getItem('aura_app_ver') || APP_VERSION; } catch (e) {}
    const changes = await fetchChangelog(stored);
    if (!changes.length) { clearUpdateBadge(); return; }
    _pendingUpdate = changes[0];
    showUpdateBadge();
    showUpdateCard(changes);
  } catch (e) { /* silent */ }
}

function showUpdateBadge() {
  const btn = els.hdrUpdate;
  if (!btn || btn.classList.contains('has-update')) return;
  btn.classList.add('has-update');
}

function clearUpdateBadge() {
  const btn = els.hdrUpdate;
  if (btn) btn.classList.remove('has-update');
}

// beautiful what's-new card: version + changelog, with Update Now / Later.
function showUpdateCard(changes) {
  if (!els.updCard || !els.updCard.classList.contains('hidden')) return;
  els.updVer.textContent = '#' + changes[0].sha;
  els.updLog.innerHTML = changes.map(c =>
    `<li><span class="upd-sha">${escHtml(c.sha)}</span>${escHtml(c.msg)}</li>`
  ).join('');
  els.updCard.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function hideUpdateCard() {
  if (els.updCard) els.updCard.classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

function initUpdateCard() {
  if (els.updNow) els.updNow.addEventListener('click', async () => {
    hideUpdateCard();
    if (_pendingUpdate) {
      await applyAppUpdate(_pendingUpdate.sha, _pendingUpdate.msg);
      clearUpdateBadge();
      _pendingUpdate = null;
    }
  });
  if (els.updLater) els.updLater.addEventListener('click', hideUpdateCard);
  // tapping the backdrop dismisses (the badge stays for a manual update)
  if (els.updCard) els.updCard.addEventListener('click', e => {
    if (e.target === els.updCard) hideUpdateCard();
  });
}

function init() {
  const hasSettings = loadAll();
  seedAppVersion();

  applyTheme();
  applyLang();
  initTabs();
  initCalendarNav();
  initLogModal();
  initConfirm();
  initSettings();
  initWelcome();
  initLanguage();
  initTheme();
  initHistoryControls();
  initQuickLog();
  if (typeof hydrateIcons === 'function') hydrateIcons(document);
  initReminders();
  initServiceWorker();
  initAudioUnlock();
  initBotHello();
  initInstallNudge();
  initNotifPermission();
  initAdvicePage();
  if (typeof initRecommendations === 'function') initRecommendations();
  initBotTap();
  initEscape();
  initUpdateCard();
  initAiSettings();

  if (!hasSettings || !state.data.lastDate) {
    wizOpen();
    renderCalendar();
  } else {
    fillSettingsForm();
    renderAll();
    animateHomeStats();
    renderBotHello();
    maybeShowInstallNudge();
    checkWellnessNudges();
    // check for a newer app version once the UI has settled
    setTimeout(silentUpdateCheck, 2500);
  }
}

document.addEventListener('DOMContentLoaded', init);