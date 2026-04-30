const CACHE_NAME = 'meu-treino-v3';
const ASSETS = [
  '/app-treino/',
  '/app-treino/index.html',
  '/app-treino/manifest.json',
  '/app-treino/icon-192.png',
  '/app-treino/icon-512.png',
  '/app-treino/gym-icon.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Rede primeiro, cache como fallback (garante que atualizações aparecem imediatamente)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
