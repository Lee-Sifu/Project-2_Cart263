const CACHE_NAME = "my-app-cache-v4";

const urlsToCache = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/click_button.js",
    "./icon.png"
];

// install
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// activate: delete old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// fetch
self.addEventListener("fetch", event => {
    const request = event.request;

    // For HTML / JS / CSS, try network first during development
    if (
        request.destination === "document" ||
        request.destination === "script" ||
        request.destination === "style"
    ) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // For images and other assets, cache first
    event.respondWith(
        caches.match(request).then(response => response || fetch(request))
    );
});