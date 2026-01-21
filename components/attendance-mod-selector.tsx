"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, LogOut } from "lucide-react"

interface AttendanceModeSelectorProps {
  onSelectMode: (mode: "check-in" | "check-out") => void
  isCheckedIn: boolean
}

export function AttendanceModSelector({ onSelectMode, isCheckedIn }: AttendanceModeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 text-center">
          <CardTitle>Pilih Tipe Presensi</CardTitle>
          <CardDescription>Anda akan melakukan presensi {isCheckedIn ? "check-out" : "check-in"}</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-4">
          <Button
            className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onSelectMode("check-in")}
            disabled={isCheckedIn}
          >
            <LogIn className="h-6 w-6" />
            <span className="font-semibold">Masuk (Check-in)</span>
          </Button>

          <Button
            className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onSelectMode("check-out")}
            disabled={!isCheckedIn}
          >
            <LogOut className="h-6 w-6" />
            <span className="font-semibold">Pulang (Check-out)</span>
          </Button>

          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-900 dark:text-yellow-100">
              {isCheckedIn ? (
                <span>
                  <strong>Status Sekarang:</strong> Anda sudah check-in. Silakan lakukan check-out untuk pulang.
                </span>
              ) : (
                <span>
                  <strong>Status Sekarang:</strong> Anda belum check-in. Silakan lakukan check-in terlebih dahulu.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
