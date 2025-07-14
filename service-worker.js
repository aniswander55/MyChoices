self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('teenrewards-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/rewards.js',
        '/manifest.json'
        // Add icons or other assets here if needed
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
}); 