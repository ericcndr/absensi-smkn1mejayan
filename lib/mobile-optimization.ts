// Mobile optimization utilities for Android & iOS PWA

export function setupMobileViewport() {
  // Ensure proper viewport meta tag is set (already in layout.tsx)
  // This prevents pinch-zoom and ensures proper scaling
  if (typeof window !== "undefined") {
    // Prevent pull-to-refresh on Android
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    })

    // Handle status bar on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const meta = document.createElement("meta")
      meta.name = "apple-mobile-web-app-status-bar-style"
      meta.content = "black-translucent"
      document.head.appendChild(meta)
    }
  }
}

export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("[v0] Notification permission granted")
      }
    })
  }
}

export function setupFullscreenMode() {
  if (typeof window !== "undefined") {
    // Request fullscreen on button press for immersive experience
    document.addEventListener("fullscreenchange", () => {
      console.log("[v0] Fullscreen changed")
    })
  }
}

export function preventDefaultIOSBehaviors() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // Prevent zoom on input focus
    document.addEventListener("touchstart", (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    })

    // Disable text selection on long press
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
  }
}
