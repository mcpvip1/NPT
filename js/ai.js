// ---- AI health assistant -------------------------------------------------
// Personal advice from a free AI, built on the user's real logged data:
// recent symptoms, moods, flow, cycle phase and profile (age/weight/height),
// plus their country so product & medicine suggestions are actually
// available where they live.
//
// Providers (both free, no credit card):
//   1. Gemini — the user pastes their free key once in Settings → AI
//      Assistant (it stays on their phone only, never in the repo).
//   2. Pollinations — keyless free tier, fallback when no key is set.
//
// NOTE: never embed a real API key in this file — the repo is public and
// GitHub's secret scanning blocks pushes containing secrets (and Google
// auto-revokes exposed keys).
function getEffectiveKey() {
  return (aiSettings().geminiKey || '').trim();
}

const AI_SETTINGS_KEY = 'aura_ai';

function aiSettings() {
  let s = { provider: 'auto', geminiKey: '' };
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (raw) s = Object.assign(s, JSON.parse(raw));
  } catch (e) {}
  if (!['auto', 'gemini', 'pollinations'].includes(s.provider)) s.provider = 'auto';
  return s;
}

function saveAiSettings(s) {
  try { localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
}

// -- where is she right now? ----------------------------------------------------
// Live IP-based detection (any country, e.g. Singapore), so the AI always
// advises for her CURRENT country. Falls back to the stored profile country
// when offline or undetectable.
let _liveCountry = null;
async function detectLiveCountry() {
  if (_liveCountry) return _liveCountry;
  try {
    const c = new AbortController();
    const timer = setTimeout(() => c.abort(), 5000);
    const r = await fetch('https://ipapi.co/country_code/', { signal: c.signal, cache: 'no-store' });
    clearTimeout(timer);
    const code = (await r.text()).trim().toLowerCase();
    if (/^[a-z]{2}$/.test(code)) _liveCountry = code;
  } catch (e) { /* keep fallback */ }
  return _liveCountry;
}

// Localized country name for ANY country code, in the user's language.
function countryName(code) {
  const cc = String(code || '').toLowerCase();
  const T = (typeof t === 'function') ? t() : {};
  if (cc === 'mm') return T.lblCountryMM || 'Myanmar';
  if (cc === 'th') return T.lblCountryTH || 'Thailand';
  try {
    const loc = (typeof locale === 'function') ? locale() : 'en-US';
    return new Intl.DisplayNames([loc], { type: 'region' }).of(cc.toUpperCase()) || cc.toUpperCase();
  } catch (e) {
    return cc.toUpperCase();
  }
}

// -- real context from the user's logs --------------------------------------
function buildAiContext(liveCode) {
  const T = t();
  const d = state.data || {};
  const lang = state.lang === 'en' ? 'en' : 'my';
  const stored = d.country === 'th' ? 'th' : 'mm';
  const code = (liveCode || stored || 'mm').toLowerCase();

  const chip = k => (T.chips && T.chips[k]) || k;
  const moodName = k => (T.moods && T.moods[k]) || k;
  const flowName = k => (T.flows && T.flows[k]) || k;

  // last 14 days with logs, newest first
  const recent = [];
  const logs = state.logs || {};
  const keys = Object.keys(logs).sort().reverse().slice(0, 14);
  keys.forEach(k => {
    const log = logs[k] || {};
    const bits = [];
    if (log.flow) bits.push(flowName(log.flow));
    (log.symptoms || []).forEach(s => bits.push(chip(s)));
    if (log.mood) bits.push(moodName(log.mood));
    if (bits.length) recent.push(k + ': ' + bits.join(', '));
  });

  // 60-day frequencies (what keeps coming back)
  const S = {}, M = {}, F = {};
  const cutoff = toKey(addDays(today(), -60));
  Object.keys(logs).forEach(k => {
    if (k < cutoff) return;
    const log = logs[k];
    if (log.flow) F[log.flow] = (F[log.flow] || 0) + 1;
    (log.symptoms || []).forEach(s => { S[s] = (S[s] || 0) + 1; });
    if (log.mood) M[log.mood] = (M[log.mood] || 0) + 1;
  });
  const top = (obj, name) => Object.keys(obj).sort((a, b) => obj[b] - obj[a])
    .slice(0, 5).map(k => `${name(k)} ×${obj[k]}`);

  // cycle position
  let cycleLine = '';
  const info = cycleInfoFor(today());
  if (info) {
    const day = Math.max(1, diffDays(info.start, today()) + 1);
    const ph = phaseFor(today());
    cycleLine = `day ${day} of ~${d.cycleLength || 28}-day cycle, phase: ${ph ? (T.phaseShort[ph] || ph) : '?'}`;
  }

  const profile = [];
  if (d.age) profile.push(`${d.age} ${lang === 'my' ? 'နှစ်' : 'years old'}`);
  if (d.weight) profile.push(`${d.weight} kg`);
  if (d.height) profile.push(`${d.height} cm`);

  return {
    lang, country: code,
    countryName: countryName(code),
    countryLive: !!liveCode,
    profile: profile.join(', ') || (lang === 'my' ? 'မဖြည့်ထားပါ' : 'not provided'),
    cycle: cycleLine || (lang === 'my' ? 'မသိပါ' : 'unknown'),
    recent,
    freqSymptoms: top(S, chip),
    freqMoods: top(M, moodName),
    freqFlow: top(F, flowName)
  };
}

function aiContextHash(ctx) {
  const s = JSON.stringify([ctx.lang, ctx.country, ctx.profile, ctx.cycle, ctx.recent, ctx.freqSymptoms, ctx.freqMoods, ctx.freqFlow]);
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return String(h);
}

// -- the prompt: strict JSON so advice lands in the right page sections --------
function buildAiJsonMessages(ctx) {
  const my = ctx.lang === 'my';
  const langName = my ? 'Burmese (မြန်မာ)' : 'English';

  const system =
`You are Aura, a warm and careful women's-health assistant inside a period-tracker app.
You are NOT a doctor and you never diagnose illness.

Reply with ONLY a JSON object — no markdown, no code fences, no other text.
Use this exact shape (all strings in ${langName}):
{
  "summary": "2-3 sentences on how she seems based on her logs",
  "mood": "warm guidance for her current mood and emotional state, tied to what she logged",
  "dailyTips": ["3-5 short daily self-care tips tied to her actual symptoms"],
  "products": [{"name": "product name", "why": "why it fits her symptoms", "where": "where to buy it in ${ctx.countryName}"}],
  "medicines": [{"name": "medicine type + example brand", "why": "why it could help", "note": "must include: check with a pharmacist/doctor and follow the package dose"}],
  "doctor": "clear 'see a doctor soon' note if her logs show warning signs, otherwise null"
}

LOCATION — DETECT FIRST
She is currently in ${ctx.countryName}. Every product and medicine must be
commonly sold in ${ctx.countryName} ONLY. Never mention, suggest, or compare
with products from any other country. Never invent brands.

SAFETY RULES
- Gentle self-care guidance only. Never state a diagnosis.
- "medicines" only when her symptoms suggest it; may be an empty array.
- If her logs show warning signs (very heavy bleeding, severe pain, cycle far
  outside her normal), put the warning in "doctor". Otherwise "doctor" is null.
- Keep every string short and scannable.`;

  const lines = [
    `Profile: ${ctx.profile}`,
    `Current country (detected from her location): ${ctx.countryName}`,
    `Cycle: ${ctx.cycle}`,
    ctx.recent.length ? 'Recent logs (newest first):\n' + ctx.recent.map(r => '- ' + r).join('\n')
                      : (my ? 'မှတ်တမ်း မရှိသေးပါ။' : 'No logs yet.'),
    ctx.freqSymptoms.length ? `Often logged symptoms (60 days): ${ctx.freqSymptoms.join(', ')}` : '',
    ctx.freqMoods.length ? `Often logged moods (60 days): ${ctx.freqMoods.join(', ')}` : '',
    ctx.freqFlow.length ? `Flow pattern (60 days): ${ctx.freqFlow.join(', ')}` : ''
  ].filter(Boolean);

  return { system, user: lines.join('\n') };
}

// -- providers ------------------------------------------------------------------
async function callGemini(key, system, user, jsonMode) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + encodeURIComponent(key);
  const gen = { temperature: 0.7, maxOutputTokens: 8192 };
  if (jsonMode) gen.responseMimeType = 'application/json';
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ parts: [{ text: user }] }],
    generationConfig: gen
  });
  // One retry on overload/rate-limit: the flash models 503 under spikes.
  let r = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if ((r.status === 503 || r.status === 429) && attempt === 0) {
      await new Promise(res => setTimeout(res, 2500));
      continue;
    }
    break;
  }
  if (!r.ok) throw new Error('gemini ' + r.status);
  const j = await r.json();
  const text = j && j.candidates && j.candidates[0] && j.candidates[0].content &&
    j.candidates[0].content.parts.map(p => p.text || '').join('');
  if (!text || !text.trim()) throw new Error('gemini empty');
  return text.trim();
}

async function callPollinations(system, user) {
  const r = await fetch('https://text.pollinations.ai/openai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-oss-20b',
      private: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  if (!r.ok) throw new Error('pollinations ' + r.status);
  const j = await r.json();
  const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
  if (!text || !String(text).trim()) throw new Error('pollinations empty');
  return String(text).trim();
}

// -- main entry: structured advice ------------------------------------------------
// Online → AI-generated sections based on her condition + current country.
// Offline (or AI failure) → the caller falls back to the classic rule-based UI.
function parseAiJson(text) {
  const clean = String(text).replace(/```(?:json)?/gi, '').trim();
  const data = JSON.parse(clean);
  if (!data || typeof data !== 'object') throw new Error('bad ai json');
  const str = v => (typeof v === 'string' ? v.trim() : '');
  const arr = v => (Array.isArray(v) ? v : []);
  return {
    summary: str(data.summary),
    mood: str(data.mood),
    dailyTips: arr(data.dailyTips).map(str).filter(Boolean).slice(0, 6),
    products: arr(data.products).slice(0, 5).map(p => ({
      name: str(p.name), why: str(p.why), where: str(p.where)
    })).filter(p => p.name),
    medicines: arr(data.medicines).slice(0, 4).map(m => ({
      name: str(m.name), why: str(m.why), note: str(m.note)
    })).filter(m => m.name),
    doctor: str(data.doctor) || null
  };
}

async function getAiAdvice(ctx) {
  const { system, user } = buildAiJsonMessages(ctx);
  const s = aiSettings();
  const key = getEffectiveKey();

  const tries = [];
  if (s.provider === 'gemini' || (s.provider === 'auto' && key)) tries.push('gemini');
  if (s.provider === 'pollinations' || s.provider === 'auto') tries.push('pollinations');
  if (!tries.length) tries.push('pollinations');

  let lastErr = null;
  for (const p of tries) {
    try {
      let text;
      if (p === 'gemini') {
        if (!key) { const e = new Error('nokey'); e.code = 'nokey'; throw e; }
        text = await callGemini(key, system, user, true);
      } else {
        text = await callPollinations(system, user);
      }
      return { data: parseAiJson(text), provider: p, ctx };
    } catch (e) {
      lastErr = e;
      if (e.code === 'nokey' || e.code === 'offline') throw e;
    }
  }
  // No key and the keyless fallback failed: guide the user to paste the key.
  if (!key && s.provider !== 'pollinations') {
    const e = new Error('nokey'); e.code = 'nokey'; throw e;
  }
  const e = new Error('failed');
  e.code = 'failed';
  e.cause = lastErr;
  throw e;
}

// -- cache (one advice per context per day) ------------------------------------------
const AI_JSON_CACHE_KEY = 'aura_ai_json';
function getAiJsonCache() {
  try {
    const raw = localStorage.getItem(AI_JSON_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || c.day !== toKey(today())) return null;
    return c;
  } catch (e) { return null; }
}

function setAiJsonCache(data, hash) {
  try {
    localStorage.setItem(AI_JSON_CACHE_KEY, JSON.stringify({ day: toKey(today()), data, hash }));
  } catch (e) {}
}

function clearAiJsonCache() {
  try { localStorage.removeItem(AI_JSON_CACHE_KEY); } catch (e) {}
}
