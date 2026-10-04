// State + persistence.
// Log shape: { "2026-09-29": { flow, symptoms: [], mood, notes } }

const LS = {
  data: 'aura_data',
  logs: 'aura_logs',
  lang: 'aura_lang',
  theme: 'aura_theme',
  notified: 'aura_notified',
  cycleSeen: 'aura_cycle_seen',
  greeted: 'aura_greeted',
  reminded: 'aura_reminded',
  installNudge: 'aura_install_nudge'
};

const DEFAULTS = {
  version: 3,
  userName: '',
  lastDate: '',
  cycleLength: 28,
  periodLength: 5,
  lutealPhase: 14,
  notify: true,
  notifyDays: 2,
  showBot: true, // our little buddy next to the health tips. flippable in settings.
  logReminder: false, // daily "hey, log today!" nudge
  logReminderTime: '21:00'
};

const VALID_MOODS = ['great', 'good', 'okay', 'low', 'bad'];
const LOG_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

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

// Normalize one raw log entry. Returns null when the entry is unusable.
// Never throws — one bad entry must not wipe the rest (see loadAll).
function sanitizeLogEntry(v) {
  if (!v || typeof v !== 'object') return null;
  if (Array.isArray(v)) {
    return {
      flow: null,
      symptoms: v.filter(s => typeof s === 'string'),
      mood: null,
      notes: ''
    };
  }
  const symptoms = Array.isArray(v.symptoms)
    ? v.symptoms.filter(s => typeof s === 'string')
    : [];
  const mood = typeof v.mood === 'string' && VALID_MOODS.includes(v.mood) ? v.mood : null;
  return {
    flow: typeof v.flow === 'string' ? v.flow : null,
    symptoms,
    mood,
    notes: typeof v.notes === 'string' ? v.notes : ''
  };
}

function loadAll() {
  const lang = localStorage.getItem(LS.lang);
  if (lang && typeof i18n !== 'undefined' && i18n[lang]) state.lang = lang;

  const theme = localStorage.getItem(LS.theme);
  if (theme === 'light' || theme === 'dark') state.theme = theme;

  const rawLogs = localStorage.getItem(LS.logs);
  if (rawLogs) {
    try {
      const parsed = JSON.parse(rawLogs);
      if (parsed && typeof parsed === 'object') {
        for (const k in parsed) {
          if (!LOG_KEY_RE.test(k)) continue;
          const entry = sanitizeLogEntry(parsed[k]);
          if (entry) state.logs[k] = entry;
        }
      }
    } catch (e) { console.warn('bad logs', e); }
  }

  const rawData = localStorage.getItem(LS.data);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed && typeof parsed === 'object') {
        state.data = { ...DEFAULTS, ...parsed };
        return true;
      }
    } catch (e) { console.warn('bad data', e); }
  }
  return false;
}

// Returns true on success, false when storage failed (e.g. quota exceeded).
function saveData() {
  try {
    localStorage.setItem(LS.data, JSON.stringify(state.data));
    return true;
  } catch (e) {
    console.warn('saveData failed', e);
    return false;
  }
}

function saveLogs() {
  try {
    localStorage.setItem(LS.logs, JSON.stringify(state.logs));
    return true;
  } catch (e) {
    console.warn('saveLogs failed', e);
    return false;
  }
}
