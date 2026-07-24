/* =====================================================================
   Service Worker — 讓 PWA 可離線使用 + 支援 App 內更新鍵
   ⚠️ 改版規則：每次更新檔案，把 CACHE 版本號 +1（例 v2.0.1 → v2.0.2）
      這樣使用者的瀏覽器才會抓到新版（對應 App Versioning Rule）
   ===================================================================== */
importScripts('./audio/manifest.js');

const CACHE = 'hangul-v3.2.0-preview-local';
const CORE_AUDIO = (self.HANGUL_AUDIO && self.HANGUL_AUDIO.coreFiles || []).map(path => './' + path);

// 要預先快取的檔案（相對路徑，配合 GitHub Pages 子目錄）
const ASSETS = [
  './',
  './index.html',
  './style.css?v=3.2.0',
  './app.js',
  './course-data.js?v=3.2.0',
  './course.js?v=3.2.0',
  './audio/manifest.js?v=3.2.0',
  './manifest.json',
  './icons/favicon-32.png',
  './icons/apple-touch-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  ...CORE_AUDIO,
];

// 安裝：把檔案存進快取
// ⚠️ 用 {cache:'reload'} 強制走網路抓最新檔，避免裝到瀏覽器 HTTP 舊快取
// ⚠️ 不在這裡 skipWaiting() — 新版會「等待」，直到使用者按 App 內的「立即更新」鍵
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))
    )
  );
});

// 啟用：清掉舊版快取，並立刻接管所有頁面
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 收到頁面送來的「SKIP_WAITING」就接管 → 這就是「立即更新」鍵的後端
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// 攔截請求：先找快取，沒有再連網路（cache-first）
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin && url.pathname.includes('/audio/')) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copy));
        }
        return response;
      }))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
