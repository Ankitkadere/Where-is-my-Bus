self.addEventListener('install', function (e) {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', function (e) {
  // Optional: intercept network requests
});
6