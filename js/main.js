// Wiring. All event listeners live here.

function switchTab(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name).classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
}

function initTabs() {
  document.querySelectorAll('.nav-btn, .side-link').forEach(btn => {
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
    els.logFlowRow.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (!wasActive) chip.classList.add('active');
  });

  els.logSymRow.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('active');
    refreshAdvicePreview();
  });

  els.logClose.addEventListener('click', closeLogModal);
  els.logModal.addEventListener('click', e => {
    if (e.target === els.logModal) closeLogModal();
  });

  els.logSave.addEventListener('click', () => {
    const key = state.selectedDate;
    if (!key) return;
    const flowChip = els.logFlowRow.querySelector('.chip.active');
    const flow = flowChip ? flowChip.dataset.flow : null;
    const symptoms = [...els.logSymRow.querySelectorAll('.chip.active')].map(c => c.dataset.sym);
    const notes = els.logNotes.value.trim();

    if (flow || symptoms.length || notes) {
      state.logs[key] = { flow, symptoms, notes };
    } else {
      delete state.logs[key];
    }
    saveLogs();

    renderCalendar();
    renderHistory();
    renderInsights();
    closeLogModal();
    toast(t().msgSaved, 'ok');
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

    if (state.data.notify && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    saveData();
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
    els.importModal.classList.remove('hidden');
  });
  els.importClose.addEventListener('click', () => els.importModal.classList.add('hidden'));
  els.importModal.addEventListener('click', e => {
    if (e.target === els.importModal) els.importModal.classList.add('hidden');
  });
  els.importGo.addEventListener('click', () => {
    const T = t();
    const raw = els.importText.value.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.data) state.data = { ...DEFAULTS, ...parsed.data };
      if (parsed.logs) {
        state.logs = {};
        for (const k in parsed.logs) {
          const v = parsed.logs[k];
          state.logs[k] = { flow: v.flow || null, symptoms: v.symptoms || [], notes: v.notes || '' };
        }
      }
      saveData(); saveLogs();
      fillSettingsForm();
      applyLang();
      renderAll();
      els.importModal.classList.add('hidden');
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
    els.welcome.classList.remove('hidden');
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
    els.welcome.classList.add('hidden');
    fillSettingsForm();
    applyLang();
    renderAll();
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
  $('fab').addEventListener('click', () => openLogModal(toKey(today())));
}

function initEscape() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!els.logModal.classList.contains('hidden')) closeLogModal();
    else if (!els.importModal.classList.contains('hidden')) els.importModal.classList.add('hidden');
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
  initEscape();

  if (!hasSettings || !state.data.lastDate) {
    els.welcome.classList.remove('hidden');
    renderCalendar();
  } else {
    fillSettingsForm();
    renderAll();
  }
}

document.addEventListener('DOMContentLoaded', init);