// Service Worker untuk PWA offline support dan caching
const CACHE_NAME = "smkn-presensi-v1"
const RUNTIME_CACHE = "smkn-presensi-runtime-v1"
const ASSETS_TO_CACHE = ["/", "/login", "/attendance", "/admin", "/globals.css", "/manifest.json", "/icon.svg"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker installing...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.log("[v0] Cache addAll error:", err)
      })
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("[v0] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const clonedResponse = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clonedResponse)
          })
        }

        return response
      })
      .catch(() => {
        // Network request failed, try cache
        return caches.match(request).then((response) => {
          return (
            response ||
            caches.match("/").then((res) => {
              return (
                res ||
                new Response("Offline - Aplikasi tidak tersedia dalam mode offline", {
                  status: 503,
                  statusText: "Service Unavailable",
                })
              )
            })
          )
        })
      }),
  )
})

// Background sync for attendance records when offline
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-attendance") {
    console.log("[v0] Background sync triggered for attendance")
    event.waitUntil(syncAttendanceData())
  }
})

async function syncAttendanceData() {
  try {
    const cache = await caches.open(RUNTIME_CACHE)
    console.log("[v0] Syncing attendance data...")
  } catch (error) {
    console.log("[v0] Sync error:", error)
  }
}

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}
  const options = {
    body: data.message || "Notifikasi dari SMKN 1 Mejayan",
    icon: "/icon-192x192.png",
    badge: "/icon-96x96.png",
    tag: "smkn-notification",
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(data.title || "SMKN 1 Mejayan", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === "/" && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/")
      }
    }),
  )
})
