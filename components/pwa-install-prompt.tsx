"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if iOS
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isAppleDevice)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show iOS installation prompt after 2 seconds on iOS
    if (isAppleDevice && !localStorage.getItem("ios-install-dismissed")) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
      return () => {
        clearInterval(timer)
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("[v0] User accepted PWA installation")
      }
    } catch (error) {
      console.error("[v0] Installation error:", error)
    } finally {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleIOSInstall = () => {
    localStorage.setItem("ios-install-dismissed", "true")
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-2xl border border-white/20 p-4 max-w-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Download className="h-4 w-4" />
              Pasang Aplikasi
            </h3>
            {isIOS ? (
              <p className="text-sm text-white/90">
                Tap tombol "Bagikan" lalu pilih "Add to Home Screen" untuk menginstal aplikasi.
              </p>
            ) : (
              <p className="text-sm text-white/90">
                Instal aplikasi presensi di home screen Anda untuk akses cepat dan offline.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (isIOS) handleIOSInstall()
              else setShowPrompt(false)
            }}
            className="text-white/70 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {!isIOS && (
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleInstall} className="flex-1 bg-white text-primary hover:bg-white/90">
              Pasang Sekarang
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPrompt(false)}
              className="text-white hover:bg-white/20"
            >
              Nanti
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
