/* eslint-disable no-restricted-globals */

const CACHE_NAME = "evocars-cache-v1";
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/js/vendors~main.chunk.js',
];

// Instalación del service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caché abierto');
      return cache.addAll(urlsToCache);
    })
  );
});

// Estrategia de cache: Network First, fallback a cache cuando no haya red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red está disponible y la respuesta es válida, almacenamos en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // Si la red falla, tratamos de obtener el contenido desde la caché
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no encontramos el recurso en la caché y es una navegación, se muestra la página offline
        if (event.request.mode === 'navigate') {
          // Si no tienes offline.html, esta línea solo devolverá "Sin conexión"
          return new Response('Sin conexión', { status: 503, statusText: 'No disponible' });
        }
        
        // Si es cualquier otro recurso, devuelve una respuesta de "Sin conexión"
        return new Response('Sin conexión', { status: 503, statusText: 'No disponible' });
      })
  );
});

// Limpieza de caches antiguos
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});