/* =====================================================================
   Service Worker — 讓 PWA 可離線使用
   ⚠️ 改版規則：每次更新檔案，把 CACHE 版本號 +1（例 v1.0.0 → v1.0.1）
      這樣使用者的瀏覽器才會抓到新版（對應 App Versioning Rule）
   ===================================================================== */
const CACHE = 'hangul-v1.2.0';

// 要預先快取的檔案（相對路徑，配合 GitHub Pages 子目錄）
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// 安裝：把檔案存進快取
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// 啟用：清掉舊版快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 攔截請求：先找快取，沒有再連網路（cache-first）
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
