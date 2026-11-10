
const CACHE_NAME = "aircraft-planner-v4";

// تحديد مسار التطبيق تلقائياً
const BASE_URL = new URL("./", self.registration.scope);

const INDEX_URL = new URL("index.html", BASE_URL).href;

const APP_FILES = [
  BASE_URL.href,
  INDEX_URL,
  new URL("manifest.webmanifest", BASE_URL).href,
  new URL("icon.svg", BASE_URL).href
];

// =====================================
// INSTALL
// =====================================
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // الصفحة الأساسية ضرورية لنجاح التثبيت
    await cache.add(
      new Request(INDEX_URL, { cache: "reload" })
    );

    // الملفات الإضافية
    await Promise.allSettled(
      APP_FILES
        .filter(url => url !== INDEX_URL)
        .map(url => cache.add(url))
    );

    await self.skipWaiting();
  })());
});

// =====================================
// ACTIVATE
// =====================================
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key =>
          key.startsWith("aircraft-planner-") &&
          key !== CACHE_NAME
        )
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

// =====================================
// FETCH
// =====================================
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // تجاهل المواقع الخارجية
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // صفحات التنقل
    if (request.mode === "navigate") {
      try {
        const response = await fetch(request);

        if (response && response.ok) {
          await cache.put(INDEX_URL, response.clone());
        }

        return response;

      } catch (error) {
        return (
          await cache.match(request) ||
          await cache.match(INDEX_URL) ||
          new Response(
            "Offline page is not cached yet. Connect to the internet and open the app once.",
            {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            }
          )
        );
      }
    }

    // الملفات المحفوظة
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // تحميل الملفات غير المحفوظة
    try {
      const response = await fetch(request);

      if (response && response.ok) {
        await cache.put(request, response.clone());
      }

      return response;

    } catch (error) {
      return new Response("", {
        status: 503,
        statusText: "Offline"
      });
    }
  })());
});
