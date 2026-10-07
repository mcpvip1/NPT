// Flat SVG icon set — minimal filled style matching the main screen tiles.
// Replaces the old 3D PNG icons (Icons8) everywhere in the UI.
var FLAT_ICONS = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3z" fill="#3b82f6"/></svg>',
  advice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2zM9 20h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" fill="#f59e0b"/></svg>',
  insights: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z" fill="#8b5cf6"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8zm1 4v6l5 3-.9 1.6L11 13V6z" fill="#6b7280"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2-1.2L14.6 4h-4l-.4 2.7a7.6 7.6 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7.5 7.5 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7.6 7.6 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.8.1-1.6 0-2.4zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill="#6b7280"/></svg>',
  avatar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm-5.5 13a7.5 7.5 0 0 1 11 0 8 8 0 0 1-11 0z" fill="#3b82f6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a6 6 0 0 0-6 6v4l-1.5 2.5h15L18 12V8a6 6 0 0 0-6-6zm-2.5 18a2.5 2.5 0 0 0 5 0z" fill="#f59e0b"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 13.6A8.6 8.6 0 1 1 10.4 3.4a7 7 0 0 0 10.2 10.2z" fill="#fbbf24"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-6v3m0 14v3M1 12h3m14 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M6.3 17.7l-2.1 2.1" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="4.5" fill="#fbbf24"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="3.5" fill="#3b82f6"/><path d="M3.5 8a3.5 3.5 0 0 1 3.5-3.5h10A3.5 3.5 0 0 1 20.5 8v2h-17z" fill="#93c5fd"/><rect x="7" y="13" width="10" height="2.2" rx="1.1" fill="#fff" opacity=".92"/><rect x="7" y="16.4" width="6.5" height="2.2" rx="1.1" fill="#fff" opacity=".65"/></svg>',
  log: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19zM14 6l4 4" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  period: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5s6.2 6.9 6.2 11.3a6.2 6.2 0 0 1-12.4 0C5.8 9.4 12 2.5 12 2.5z" fill="#f43f5e"/></svg>',
  fertile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 1.5l2.1 6.3 6.4 2.2-6.4 2.1L9 18.5l-2.1-6.4L.5 10l6.4-2.2z" fill="#8b5cf6"/><path d="M18.3 13.5l1.3 3.6 3.6 1.3-3.6 1.3-1.3 3.6-1.3-3.6-3.6-1.3 3.6-1.3z" fill="#8b5cf6" opacity=".65"/></svg>',
  ovulation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c-3.6 0-6.6 5.4-6.6 10.2a6.6 6.6 0 0 0 13.2 0C18.6 8.2 15.6 2.8 12 2.8z" fill="#f59e0b"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>',
  export: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3m0 0L7 8m5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  import: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13h8l1-13" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" stroke="#10b981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z" fill="#3b82f6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C7 16.5 3 13 3 8.8A4.8 4.8 0 0 1 7.8 4c1.8 0 3.2 1 4.2 2.3C13 5 14.4 4 16.2 4A4.8 4.8 0 0 1 21 8.8c0 4.2-4 7.7-9 12.2z" fill="#f43f5e"/></svg>',
  pills: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="12" height="7" rx="3.5" transform="rotate(-30 9 11.5)" fill="#10b981"/><rect x="12" y="8" width="12" height="7" rx="3.5" transform="rotate(30 18 11.5)" fill="#34d399"/></svg>',
  tea: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M7 7c0-1 .8-1 .8-2M11 7c0-1 .8-1 .8-2" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
  "shopping-bag": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5zm4 0a4 4 0 0 1 8 0" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
};

// <span data-icon="name"></span> -> inline flat SVG (same API as before).
function iconFlat(name, extra) {
  const svg = FLAT_ICONS[name] || '';
  if (!svg) return '';
  return svg.replace('<svg ', `<svg class="ic3d${extra ? ' ' + extra : ''}" `);
}
function hydrateIcons(root) {
  (root || document).querySelectorAll('span[data-icon]').forEach(s => {
    const svg = FLAT_ICONS[s.dataset.icon];
    if (!svg) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = svg.trim();
    const el = tpl.content.firstChild;
    el.classList.add('ic3d');
    if (s.dataset.cls) s.dataset.cls.split(' ').forEach(c => el.classList.add(c));
    s.replaceWith(el);
  });
}
// Backwards-compatible aliases (old 3D API names).
var ICONS3D = FLAT_ICONS;
function icon3d(name, extra) { return iconFlat(name, extra); }
