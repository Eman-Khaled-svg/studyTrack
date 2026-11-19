// Service worker بسيط: بيخزّن الموقع والخطوط والأيقونات علشان يشتغل من غير نت.
// لو غيّرت حاجة كبيرة ومش بتظهر، غيّر رقم النسخة تحت.
const CACHE = "studytrack-v1";
const CDN = /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./favicon.svg"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// بيرد من الكاش فورًا وبيحدّثه من النت في الخلفية
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && !CDN.test(u.hostname)) return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(r);
      const net = fetch(r)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) c.put(r, res.clone());
          return res;
        })
        .catch(() => hit || (r.mode === "navigate" ? c.match("./") : Response.error()));
      return hit || net;
    })
  );
});
