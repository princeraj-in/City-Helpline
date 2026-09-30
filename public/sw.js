const CACHE_NAME = 'studolink-pwa-v3';

// Only active on official production custom domain
const isOfficialDomain = self.location.hostname === 'studolink.imprince.me' || self.location.hostname === 'studolink.vercel.app';

if (!isOfficialDomain) {
  // In development / preview run.app environments: self-destruct immediately to prevent white-screens
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
    );
  });
} else {
  const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
    '/favicon.svg',
    '/icon-192.png',
    '/icon-512.png',
    '/logo.png',
    '/logo.svg'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('SW cache.addAll non-critical warning:', err);
        });
      })
    );
    self.skipWaiting();
  });

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

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
      return;
    }

    // Never intercept Vite internal modules, source files or API calls
    const url = event.request.url;
    if (url.includes('/api/') || url.includes('/@') || url.includes('/src/') || url.includes('/node_modules/')) {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
            const isFirestoreLive = url.includes('firestore.googleapis.com') || url.includes('identitytoolkit.googleapis.com');
            if (!isFirestoreLive) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache).catch(() => {});
              });
            }
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return fetch(event.request);
          });
        })
    );
  });
}
