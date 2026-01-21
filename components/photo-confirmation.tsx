"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Zap } from "lucide-react"

interface PhotoConfirmationProps {
  photo: string
  attendanceType: "check-in" | "check-out"
  faceScore: number
  distance: number
  radiusMeters: number
  onConfirm: () => void
  onRetake: () => void
  isProcessing: boolean
}

export function PhotoConfirmation({
  photo,
  attendanceType,
  faceScore,
  distance,
  radiusMeters,
  onConfirm,
  onRetake,
  isProcessing,
}: PhotoConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Konfirmasi {attendanceType === "check-in" ? "Check-in" : "Check-out"}
          </CardTitle>
          <CardDescription>Periksa foto sebelum mengirim ke admin</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Photo Preview */}
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 bg-muted">
            <img src={photo || "/placeholder.svg"} alt="Confirmation" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-muted-foreground mb-1">Akurasi Wajah</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{faceScore}%</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <p className="text-xs text-muted-foreground mb-1">Jarak GPS</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{distance.toFixed(0)}m</p>
            </div>
          </div>

          {/* Status */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm font-medium text-foreground">
              Status: <span className="text-accent">Dalam radius ({radiusMeters}m)</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 bg-transparent"
              onClick={onRetake}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              Ulang Foto
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={onConfirm}
              disabled={isProcessing}
            >
              <Check className="h-4 w-4 mr-2" />
              {isProcessing ? "Mengirim..." : "Konfirmasi"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Foto akan dikirim ke admin untuk verifikasi final
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
