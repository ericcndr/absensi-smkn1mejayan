"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"

interface EmployeeLocation {
  id: string
  name: string
  employeeId: string
  lat: number
  lng: number
  checkInTime?: string
  checkOutTime?: string
  status: "checked-in" | "checked-out" | "absent"
}

interface AttendanceMapProps {
  officeLatitude: number
  officeLongitude: number
  radiusMeters: number
  officeName: string
  currentUserLocation?: { latitude: number; longitude: number }
}

export function AttendanceMap({
  officeLatitude,
  officeLongitude,
  radiusMeters,
  officeName,
  currentUserLocation,
}: AttendanceMapProps) {
  const [employees, setEmployees] = useState<EmployeeLocation[]>([])

  useEffect(() => {
    // Get attendance data from localStorage
    const attendanceData = localStorage.getItem("attendance")
    if (attendanceData) {
      const records = JSON.parse(attendanceData)
      const today = new Date().toISOString().split("T")[0]
      const todayRecords = records.filter((r: any) => r.date === today)

      // Simulate employee locations for demo
      const employeeLocations: EmployeeLocation[] = todayRecords.map((record: any, index: number) => {
        const userData = localStorage.getItem("users")
        const users = userData ? JSON.parse(userData) : []
        const user = users.find((u: any) => u.id === record.userId)

        // Create random variations of coordinates within radius for demo
        const angle = (index / Math.max(todayRecords.length, 1)) * Math.PI * 2
        const distance = (radiusMeters / 3) * (0.5 + Math.random() * 0.5)
        const lat = officeLatitude + (distance / 111000) * Math.cos(angle)
        const lng = officeLongitude + (distance / (111000 * Math.cos((officeLatitude * Math.PI) / 180))) * Math.sin(angle)

        return {
          id: record.id,
          name: user?.name || "Unknown",
          employeeId: user?.employeeId || "N/A",
          lat,
          lng,
          checkInTime: record.checkIn,
          checkOutTime: record.checkOut,
          status: record.checkOut ? "checked-out" : "checked-in",
        }
      })

      setEmployees(employeeLocations)
    }
  }, [radiusMeters, officeLatitude, officeLongitude])

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-primary flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Peta Lokasi Presensi
            </CardTitle>
            <CardDescription>{officeName}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Users className="h-3 w-3 mr-1" />
            {employees.length} Peserta
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Map Display with SVG Circle */}
        <div className="rounded-lg overflow-hidden border border-primary/20 bg-muted aspect-square flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="400" height="400" fill="#f5f5f5" className="dark:fill-slate-800" />
            
            {/* Radius Circle */}
            <circle cx="200" cy="200" r="120" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* School Location (Center) */}
            <circle cx="200" cy="200" r="12" fill="#dc2626" className="animate-pulse" />
            <circle cx="200" cy="200" r="8" fill="#ffffff" />
            <text x="200" y="230" textAnchor="middle" className="text-xs fill-slate-700 dark:fill-slate-300" fontSize="12">
              Sekolah
            </text>
            
            {/* Current User Location */}
            {currentUserLocation && (
              <>
                <circle cx="200" cy="150" r="10" fill="#3b82f6" />
                <circle cx="200" cy="150" r="6" fill="#ffffff" />
                <text x="200" y="175" textAnchor="middle" className="text-xs fill-slate-700 dark:fill-slate-300" fontSize="12">
                  Anda
                </text>
              </>
            )}
            
            {/* Employee Locations */}
            {employees.map((employee, index) => {
              const angle = (index / Math.max(employees.length, 1)) * Math.PI * 2
              const radius = 80
              const x = 200 + radius * Math.cos(angle)
              const y = 200 + radius * Math.sin(angle)
              return (
                <g key={employee.id}>
                  <circle cx={x} cy={y} r="8" fill="#10b981" opacity="0.8" />
                  <circle cx={x} cy={y} r="5" fill="#ffffff" />
                </g>
              )
            })}
            
            {/* Distance indicator */}
            <text x="200" y="30" textAnchor="middle" className="text-xs font-bold fill-slate-900 dark:fill-slate-100" fontSize="14">
              Jangkauan: {radiusMeters}m
            </text>
          </svg>
        </div>
        
        {/* Coordinates Info */}
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">📍 Koordinat Lokasi:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Latitude</p>
              <p className="text-sm font-mono font-bold text-primary">{officeLatitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Longitude</p>
              <p className="text-sm font-mono font-bold text-primary">{officeLongitude.toFixed(6)}</p>
            </div>
          </div>
          {currentUserLocation && (
            <div className="mt-2 pt-2 border-t border-primary/20 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Lokasi Anda (Lat)</p>
                <p className="text-sm font-mono text-accent">{currentUserLocation.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lokasi Anda (Lng)</p>
                <p className="text-sm font-mono text-accent">{currentUserLocation.longitude.toFixed(6)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="font-semibold text-sm text-foreground mb-3">Peserta yang Sudah Presensi:</p>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div
                key={employee.id}
                className="p-3 rounded-lg bg-muted/50 border border-primary/10 hover:border-primary/30 transition-colors flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge
                    variant={employee.status === "checked-in" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {employee.status === "checked-in" ? "Check-in" : "Check-out"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {employee.status === "checked-in" ? employee.checkInTime : employee.checkOutTime}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <p className="text-sm">Belum ada peserta yang melakukan presensi hari ini</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 space-y-2">
          <p className="font-semibold text-xs text-blue-900 dark:text-blue-100">Info Peta:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-blue-900 dark:text-blue-100">Lokasi Sekolah</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-blue-900 dark:text-blue-100">Lokasi Peserta</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
