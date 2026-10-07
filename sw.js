// Aura service worker — offline cache + notification taps.
// No build step, no server. Keeps the app shell cached so it opens
// instantly and still works with flaky connections.
//
// v7: fresh cache for calendar-top home + animated insights ring
// v6: fresh cache for the home restructure (tiles, no banner)
// v5: fresh cache for the pink mobile-layout fix
// v4: fixed a cache-poisoning bug — the old worker cached EVERYTHING it
// fetched, including 404/error responses, and served them forever
// (cache-first). Now only successful responses are cached, and assets are
// cached one by one so a single failure can't abort the whole install.

const CACHE = 'aura-v61';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/utils.js',
  './js/i18n.js',
  './js/store.js',
  './js/cycle.js',
  './js/icons-3d.js',
  './js/ui.js',
  './js/recommend.js',
  './js/ai.js',
  './js/main.js',
  './manifest.json',
  './bot-icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    try {
      const c = await caches.open(CACHE);
      // one by one: a single failed file must not abort the whole install,
      // and error responses are never cached
      await Promise.all(ASSETS.map(async url => {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (res && res.ok) await c.put(url, res);
        } catch (_) { /* offline: skip this file */ }
      }));
    } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      // never cache errors: a cached 404 would poison the app forever
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

// tapping a notification brings the app back
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      return self.clients.openWindow('./index.html');
    })
  );
});
