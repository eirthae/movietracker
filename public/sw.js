// Minimal service worker: exists so browsers treat the site as an installable
// app ("Install app" on Android). No caching — data changes weekly and the
// app is tiny; network passthrough keeps behaviour identical to the plain site.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
