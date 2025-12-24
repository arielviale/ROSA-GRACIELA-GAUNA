
const CACHE_NAME = 'hc-v2';
const ASSETS = [
  './',
  'index.html',
  'assets/logo.png',
  'manifest.json'
];

// Instalación: Cachear recursos estáticos básicos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de versiones antiguas para evitar conflictos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de red: Intentar red primero, caer a caché para offline
self.addEventListener('fetch', (e) => {
  // Solo interceptar peticiones del mismo origen para el caché local
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resClone);
          });
          return response;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
