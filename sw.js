
const CACHE_NAME = 'hc-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap'
];

// Instalación: Guardar archivos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones del mismo origen o CDNs permitidos
  if (event.request.url.startsWith(self.location.origin) || event.request.url.includes('googleapis') || event.request.url.includes('tailwindcss')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la red funciona, clonamos la respuesta en el caché
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
          return response;
        })
        .catch(() => {
          // Si falla la red (offline), buscamos en el caché
          return caches.match(event.request);
        })
    );
  }
});
