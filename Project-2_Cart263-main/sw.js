const CACHE_NAME = "my-app-cache-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/click_button.js",
    "./icon.png"
];

// loading cache
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// requesting cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});