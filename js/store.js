// State + persistence.
// Log shape: { "2026-09-29": { flow, symptoms: [], notes } }

const LS = {
  data: 'aura_data',
  logs: 'aura_logs',
  lang: 'aura_lang',
  theme: 'aura_theme',
  notified: 'aura_notified',
  cycleSeen: 'aura_cycle_seen'
};

const DEFAULTS = {
  version: 3,
  userName: '',
  lastDate: '',
  cycleLength: 28,
  periodLength: 5,
  lutealPhase: 14,
  notify: true,
  notifyDays: 2
};

const state = {
  data: { ...DEFAULTS },
  logs: {},
  lang: 'my',
  theme: 'light',
  viewDate: new Date(),
  selectedDate: null,
  historyMonth: 'all',
  historySearch: ''
};

function loadAll() {
  const lang = localStorage.getItem(LS.lang);
  if (lang) state.lang = lang;

  const theme = localStorage.getItem(LS.theme);
  if (theme) state.theme = theme;

  const rawLogs = localStorage.getItem(LS.logs);
  if (rawLogs) {
    try {
      const parsed = JSON.parse(rawLogs);
      for (const k in parsed) {
        const v = parsed[k];
        if (Array.isArray(v)) {
          state.logs[k] = { flow: null, symptoms: v, notes: '' };
        } else {
          state.logs[k] = {
            flow: v.flow || null,
            symptoms: v.symptoms || [],
            notes: v.notes || ''
          };
        }
      }
    } catch (e) { console.warn('bad logs', e); }
  }

  const rawData = localStorage.getItem(LS.data);
  if (rawData) {
    try {
      state.data = { ...DEFAULTS, ...JSON.parse(rawData) };
      return true;
    } catch (e) { console.warn('bad data', e); }
  }
  return false;
}

function saveData() { localStorage.setItem(LS.data, JSON.stringify(state.data)); }
function saveLogs() { localStorage.setItem(LS.logs, JSON.stringify(state.logs)); }