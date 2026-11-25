/* J-SIKAP service worker: menyimpan "kulit" aplikasi (ikon, layar pembuka) agar terbuka cepat.
   Data siswa TIDAK disimpan di sini; semuanya tetap di Google Sheets. */
const CACHE = 'jsikap-v1';
const KULIT = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(KULIT)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Apps Script & Google tidak disentuh
  // jaringan dulu (agar URL baru di index.html langsung terpakai), cadangan dari cache bila offline
  e.respondWith(fetch(e.request).then(r => {
    const salin = r.clone(); caches.open(CACHE).then(c => c.put(e.request, salin)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
