// Wiring. All event listeners live here.

function switchTab(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name).classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  currentTab = name;
  renderHeader();
  if (name === 'tab-advice') renderAdvicePage();
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
          botName: typeof d.botName === 'string' && d.botName.trim() ? d.botName.trim().slice(0, 24) : 'Aura'
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
    openModal(els.welcome);
    toast(T.msgDeleted, 'ok');
  });
}

function initWelcome() {
  els.welcomeForm.addEventListener('submit', e => {
    e.preventDefault();
    state.data.userName = $('w-name').value.trim();
    state.data.lastDate = $('w-last').value;
    state.data.cycleLength = clamp(parseInt($('w-cycle').value, 10), 15, 90, 28);
    state.data.periodLength = clamp(parseInt($('w-period').value, 10), 1, 15, 5);
    state.data.lutealPhase = 14;
    state.data.notify = true;
    state.data.notifyDays = 2;

    saveData();
    closeModal(els.welcome);
    fillSettingsForm();
    applyLang();
    renderAll();
    renderBotHello(); // greet the new user right away
    maybeShowInstallNudge();
    toast(t().msgSaved, 'ok');
  });
}

function initLanguage() {
  const onChange = e => {
    state.lang = e.target.value;
    localStorage.setItem(LS.lang, state.lang);
    applyLang();
    renderAll();
  };
  els.langSelect.addEventListener('change', onChange);
  els.langSelectDesktop.addEventListener('change', onChange);
}

function initTheme() {
  const toggle = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  };
  els.themeToggle.addEventListener('click', toggle);
  els.themeToggleDesktop.addEventListener('click', toggle);
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
  const ql = $('q-log');
  if (ql) ql.addEventListener('click', () => openLogModal(toKey(today())));
  const nl = $('nav-log');
  if (nl) nl.addEventListener('click', () => openLogModal(toKey(today())));

  // Update button in the topbar: reload every part of the UI so any
  // change (settings, logs, language) is reflected everywhere at once.
  const upd = $('refresh-app');
  if (upd) upd.addEventListener('click', () => {
    upd.classList.remove('spinning');
    void upd.offsetWidth;
    upd.classList.add('spinning');
    applyLang();
    renderAll();
    renderBotHello();
    refreshBotSlots();
    if (document.getElementById('tab-advice').classList.contains('active')) renderAdvicePage();
    setTimeout(() => upd.classList.remove('spinning'), 750);
  });

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
  });
}

function init() {
  const hasSettings = loadAll();

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
  initReminders();
  initServiceWorker();
  initAudioUnlock();
  initBotHello();
  initInstallNudge();
  initNotifPermission();
  initAdvicePage();
  initBotTap();
  initEscape();

  if (!hasSettings || !state.data.lastDate) {
    openModal(els.welcome);
    renderCalendar();
  } else {
    fillSettingsForm();
    renderAll();
    renderBotHello();
    maybeShowInstallNudge();
    checkWellnessNudges();
  }
}

document.addEventListener('DOMContentLoaded', init);