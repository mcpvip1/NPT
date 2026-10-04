// Small helpers. Nothing here touches the DOM.

const MS_DAY = 86400000;

// Do NOT use new Date("YYYY-MM-DD") — it parses as UTC.
function parseDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function midnight(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function today() { return midnight(new Date()); }

function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function diffDays(a, b) {
  return Math.round((midnight(b) - midnight(a)) / MS_DAY);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function clamp(v, lo, hi, fallback) {
  if (isNaN(v)) return fallback;
  return Math.min(hi, Math.max(lo, v));
}

// Optional numeric field: empty or out-of-range -> null.
function numOrNull(v, min, max) {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(v);
  if (isNaN(n) || n < min || n > max) return null;
  return Math.round(n * 10) / 10;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const $ = id => document.getElementById(id);