"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraReady(true)
        setError(null)
      }
    } catch (err) {
      console.error("[v0] Camera error:", err)
      setError("Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraReady(false)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg", 0.9)
      stopCamera()
      onCapture(imageData)
    }
  }, [stopCamera, onCapture])

  const handleCancel = useCallback(() => {
    stopCamera()
    onCancel()
  }, [stopCamera, onCancel])

  // Auto-start camera on mount
  useState(() => {
    startCamera()
    return () => stopCamera()
  })

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ambil Foto Selfie</h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                  <p className="text-sm text-muted-foreground">Memuat kamera...</p>
                </div>
              </div>
            )}

            {isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-primary rounded-full w-48 h-48 opacity-50 shadow-lg"></div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-2">
            <Button onClick={startCamera} variant="outline" className="flex-1 bg-transparent" disabled={isCameraReady}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Ulangi
            </Button>
            <Button onClick={capturePhoto} className="flex-1 gradient-bg text-white" disabled={!isCameraReady}>
              <Camera className="h-4 w-4 mr-2" />
              Ambil Foto
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Posisikan wajah Anda di tengah lingkaran untuk hasil terbaik
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
