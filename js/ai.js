// ---- AI health assistant -------------------------------------------------
// Personal advice from a free AI, built on the user's real logged data:
// recent symptoms, moods, flow, cycle phase and profile (age/weight/height),
// plus their country so product & medicine suggestions are actually
// available where they live.
//
// Providers (both free, no credit card):
//   1. Gemini — the user pastes their own free key from Google AI Studio
//      (best quality, generous free quota). Saved in localStorage only.
//   2. Pollinations — keyless free tier, used when no Gemini key is set.
//
// The AI never replaces a doctor: the prompt asks for gentle, conservative
// guidance, and the app's own red-flag strip stays above the AI card.

const AI_CACHE_KEY = 'aura_ai_cache';
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

// -- real context from the user's logs --------------------------------------
function buildAiContext() {
  const T = t();
  const d = state.data || {};
  const lang = state.lang === 'en' ? 'en' : 'my';
  const country = d.country === 'th' ? 'th' : 'mm';

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
    lang, country,
    countryName: country === 'th' ? T.lblCountryTH : T.lblCountryMM,
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

// -- the prompt ---------------------------------------------------------------
function buildAiMessages(ctx) {
  const my = ctx.lang === 'my';
  const langName = my ? 'Burmese (မြန်မာ)' : 'English';

  const system =
`You are Aura, a warm and careful women's-health assistant inside a period-tracker app.
You are NOT a doctor and you never diagnose illness.

Reply ONLY in ${langName}. Keep it personal, specific and scannable — short lines, no walls of text.

SAFETY RULES
- Give gentle self-care guidance only. Never state a diagnosis.
- For any medicine: name the type and an example brand actually sold in ${ctx.countryName}, and ALWAYS add that she should check with a pharmacist or doctor and follow the package dose.
- Only suggest products and medicines that are commonly sold in ${ctx.countryName} (real brand names you know exist there, e.g. from pharmacies or convenience stores). Never invent brands.
- If the logs show warning signs (very heavy bleeding, severe pain, cycle far outside her normal), put a clear "see a doctor soon" note FIRST.
- End with one short line that this is friendly guidance, not medical advice. Do not repeat disclaimers.

FORMAT (markdown, whole reply under 350 words)
## 💗 Summary
2-3 sentences on how she seems based on her logs.
## 🌿 Self-care tips
3-5 short bullets tied to her actual symptoms and mood.
## 🛍️ Worth getting in ${ctx.countryName}
2-4 items. Each: **product name** — why it fits her — where to find it.
## 💊 If medicine could help
Only if her symptoms suggest it. Type + example brand in ${ctx.countryName} + pharmacist note.
## 🚩 Doctor check
Only if warning signs exist; otherwise write: ${my ? 'မှတ်တမ်းတွေမှာ စိုးရိမ်စရာ မတွေ့ပါ 👍' : 'Nothing alarming in your logs 👍'}`;

  const lines = [
    `Profile: ${ctx.profile}`,
    `Country: ${ctx.countryName}`,
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
async function callGemini(key, system, user) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(key);
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: user }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
    })
  });
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

// -- main entry -------------------------------------------------------------------
async function askAiAdvice() {
  const online = (typeof hasInternet === 'function') ? await hasInternet(6000) : navigator.onLine !== false;
  if (!online) { const e = new Error('offline'); e.code = 'offline'; throw e; }

  const ctx = buildAiContext();
  const { system, user } = buildAiMessages(ctx);
  const s = aiSettings();

  const tries = [];
  if (s.provider === 'gemini' || (s.provider === 'auto' && s.geminiKey)) tries.push('gemini');
  if (s.provider === 'pollinations' || s.provider === 'auto') tries.push('pollinations');
  if (!tries.length) tries.push('pollinations');

  let lastErr = null;
  for (const p of tries) {
    try {
      if (p === 'gemini') {
        if (!s.geminiKey) { const e = new Error('nokey'); e.code = 'nokey'; throw e; }
        const text = await callGemini(s.geminiKey, system, user);
        return { text, provider: 'gemini', ctx };
      }
      const text = await callPollinations(system, user);
      return { text, provider: 'pollinations', ctx };
    } catch (e) {
      lastErr = e;
      if (e.code === 'nokey' || e.code === 'offline') throw e;
    }
  }
  const e = new Error('failed');
  e.code = 'failed';
  e.cause = lastErr;
  throw e;
}

// -- tiny safe markdown renderer ----------------------------------------------------
function aiMdToHtml(md) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

  const out = [];
  const lines = String(md).split('\n');
  let list = null; // 'ul' | 'ol' | null

  const closeList = () => { if (list) { out.push(list === 'ul' ? '</ul>' : '</ol>'); list = null; } };

  lines.forEach(raw => {
    const line = raw.trim();
    const h = line.match(/^(#{2,3})\s+(.*)/);
    const ul = line.match(/^[-*•]\s+(.*)/);
    const ol = line.match(/^\d+[.)]\s+(.*)/);
    if (h) {
      closeList();
      out.push(h[1] === '##' ? `<h4 class="ai-h">${inline(h[2])}</h4>` : `<h5 class="ai-h">${inline(h[2])}</h5>`);
    } else if (ul) {
      if (list !== 'ul') { closeList(); out.push('<ul class="ai-list">'); list = 'ul'; }
      out.push(`<li>${inline(ul[1])}</li>`);
    } else if (ol) {
      if (list !== 'ol') { closeList(); out.push('<ol class="ai-list">'); list = 'ol'; }
      out.push(`<li>${inline(ol[1])}</li>`);
    } else if (!line) {
      closeList();
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  });
  closeList();
  return out.join('');
}

// -- cache (one advice per context per day) ------------------------------------------
function getAiCache() {
  try {
    const raw = localStorage.getItem(AI_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || c.day !== toKey(today())) return null;
    return c;
  } catch (e) { return null; }
}

function setAiCache(html, hash, provider) {
  try {
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify({ day: toKey(today()), html, hash, provider }));
  } catch (e) {}
}
