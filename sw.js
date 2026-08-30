const CACHE_NAME = 'klassieke-muziek-tracker-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json'
];

// Bij installatie: sla de kernbestanden alvast lokaal op
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Oude caches opruimen bij een update van de service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Bij elk netwerkverzoek: geef eerst de lokale kopie terug indien aanwezig, anders naar internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
