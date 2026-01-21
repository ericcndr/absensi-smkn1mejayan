"use client"

import { MapPin, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Coordinates } from "@/lib/gps"

interface LocationStatusProps {
  userLocation: Coordinates | null
  officeLocation: Coordinates
  officeName: string
  isWithinRadius: boolean
  radiusMeters: number
  distance?: number
}

export function LocationStatus({
  userLocation,
  officeLocation,
  officeName,
  isWithinRadius,
  radiusMeters,
  distance,
}: LocationStatusProps) {
  return (
    <Card
      className={
        isWithinRadius ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-destructive bg-destructive/10"
      }
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${isWithinRadius ? "bg-green-100 dark:bg-green-900" : "bg-destructive/20"}`}
          >
            <MapPin
              className={`h-5 w-5 ${isWithinRadius ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{officeName}</h3>
              <Badge variant={isWithinRadius ? "default" : "destructive"} className="gap-1">
                {isWithinRadius ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {isWithinRadius ? "Dalam Radius" : "Diluar Radius"}
              </Badge>
            </div>

            {userLocation && distance !== undefined && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Jarak Anda: {distance.toFixed(0)} meter</p>
                <p>Radius yang diizinkan: {radiusMeters} meter</p>
              </div>
            )}

            {!userLocation && <p className="text-sm text-destructive">Tidak dapat mendeteksi lokasi Anda</p>}

            <div className="text-xs text-muted-foreground">
              <p>
                Lat: {officeLocation.latitude.toFixed(6)}, Long: {officeLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
