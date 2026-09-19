// Network-first for the page so an update always lands when online, cache-first for
// the static assets. Bump CACHE to purge everything from an older deploy.
const CACHE = 'tz-v15';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './cities.txt'];

self.addEventListener('install', e => {
  // cache:'reload' skips the browser's HTTP cache (GitHub Pages allows 10 minutes), so a new version
  // never pins a stale manifest or icon until the next CACHE bump
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // all danpune.github.io sites share one origin and one Cache Storage: touch only tz- caches
      .then(ks => Promise.all(ks.filter(k => k.startsWith('tz-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // never cache the visit counter

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        // only the app itself may become the offline copy: a 404 used to replace it with GitHub's error
        // page, and any other page on the site (how-it-works.html) would have replaced it too
        .then(res => { if (res.ok && /\/(index\.html)?$/.test(url.pathname)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)) } return res })
        // offline, only the app's own address gets the saved app; how-it-works.html gets the normal offline error
        .catch(() => /\/(index\.html)?$/.test(url.pathname) ? caches.match('./index.html').then(r => r || caches.match('./')) : Response.error())
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
      return res;
    }).catch(() => hit))
  );
});
