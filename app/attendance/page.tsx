"use client"

import { useState, useEffect } from "react"
import { Clock, Camera, MapPin, CheckCircle, XCircle, LogOut, History, Home, TagsIcon as TabsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraCapture } from "@/components/camera-capture"
import { LocationStatus } from "@/components/location-status"
import { NotificationCenter } from "@/components/notification-center"
import { PhotoConfirmation } from "@/components/photo-confirmation"
import { AttendanceModSelector } from "@/components/attendance-mod-selector"
import { AttendanceMap } from "@/components/attendance-map"
import { getCurrentLocation, isWithinRadius, calculateDistance, type Coordinates } from "@/lib/gps"
import { detectFaceAndSpoofing } from "@/lib/face-detection"
import { Spinner } from "@/components/ui/spinner"
import {
  getCurrentUser,
  getTodayAttendanceForUser,
  addAttendanceRecord,
  updateAttendanceRecord,
  getAttendanceByUser,
  addNotification,
  getSettings,
  setCurrentUser,
} from "@/lib/storage"
import { useRouter } from "next/navigation"

interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut: string | null
  status: "present" | "late" | "absent"
}

export default function AttendancePage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [user, setUser] = useState<any>(null)
  const [todayRecord, setTodayRecord] = useState<any>(null)
  const [recentAttendance, setRecentAttendance] = useState<any[]>([])
  const [office, setOffice] = useState<any>(null)
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [selectedMode, setSelectedMode] = useState<"check-in" | "check-out" | null>(null)
  const [showPhotoConfirm, setShowPhotoConfirm] = useState(false)
  const [faceScore, setFaceScore] = useState(0)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    const record = getTodayAttendanceForUser(currentUser.id)
    setTodayRecord(record)

    const records = getAttendanceByUser(currentUser.id).slice(-5).reverse()
    setRecentAttendance(records)

    // Load settings from storage
    const settings = getSettings()
    setOffice({
      id: "1",
      name: settings.officeName,
      address: settings.officeAddress,
      latitude: settings.officeLatitude,
      longitude: settings.officeLongitude,
      radiusMeters: settings.radiusMeters,
    })
  }, [router])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Get user location on mount
  useEffect(() => {
    async function fetchLocation() {
      const { coordinates, error } = await getCurrentLocation()
      if (error) {
        setLocationError(error)
      } else {
        setUserLocation(coordinates)
      }
    }
    fetchLocation()
  }, [])

  const handleCameraOpen = () => {
    setShowModeSelector(true)
  }

  const handleModeSelected = (mode: "check-in" | "check-out") => {
    setSelectedMode(mode)
    setShowModeSelector(false)
    setShowCamera(true)
  }

  const handlePhotoCapture = async (imageData: string) => {
    setShowCamera(false)
    setCapturedPhoto(imageData)
    setIsProcessing(true)
    setAlert(null)

    try {
      // Verify location
      if (!userLocation) {
        throw new Error("Lokasi tidak terdeteksi. Pastikan GPS aktif.")
      }

      const distance = calculateDistance(userLocation, office)
      const withinRadius = isWithinRadius(userLocation, office, office.radiusMeters)

      if (!withinRadius) {
        throw new Error(`Anda berada di luar radius sekolah (${distance.toFixed(0)}m dari ${office.radiusMeters}m)`)
      }

      // Detect face and spoofing
      const faceResult = await detectFaceAndSpoofing(imageData)

      if (!faceResult.isValid) {
        throw new Error(faceResult.message)
      }

      if (faceResult.isSpoofing) {
        throw new Error("Terdeteksi foto palsu atau layar. Gunakan wajah asli Anda.")
      }

      if (faceResult.confidence < 70) {
        throw new Error("Wajah tidak terdeteksi dengan jelas. Silakan foto ulang.")
      }

      // Show photo confirmation dialog
      setFaceScore(faceResult.confidence)
      setShowPhotoConfirm(true)
      setIsProcessing(false)
    } catch (error) {
      console.error("[v0] Attendance error:", error)
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      })
      setCapturedPhoto(null)
      setIsProcessing(false)
    }
  }

  const handlePhotoConfirm = async () => {
    if (!capturedPhoto || !userLocation) return

    setIsProcessing(true)
    setShowPhotoConfirm(false)

    try {
      const distance = calculateDistance(userLocation, office)

      if (!todayRecord || selectedMode === "check-out") {
        if (!todayRecord && selectedMode === "check-in") {
          // Check in
          const now = new Date()
          const checkInTime = now.toTimeString().split(" ")[0].substring(0, 5)
          const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0)

          const newRecord = addAttendanceRecord({
            userId: user.id,
            date: now.toISOString().split("T")[0],
            checkIn: checkInTime,
            checkInPhoto: capturedPhoto,
            checkInLocation: { lat: userLocation.latitude, lng: userLocation.longitude },
            checkInDistance: distance,
            checkInFaceScore: faceScore,
            status: isLate ? "late" : "present",
          })

          setTodayRecord(newRecord)

          addNotification({
            userId: user.id,
            title: "Check-in Berhasil",
            message: `Anda berhasil check-in pada ${checkInTime}`,
            type: "success",
            read: false,
            createdAt: new Date().toISOString(),
          })

          setAlert({
            type: "success",
            message: `Berhasil check-in pada ${checkInTime}! Foto dikirim ke admin.`,
          })
        } else if (todayRecord && selectedMode === "check-out") {
          // Check out
          const now = new Date()
          const checkOutTime = now.toTimeString().split(" ")[0].substring(0, 5)

          updateAttendanceRecord(todayRecord.id, {
            checkOut: checkOutTime,
            checkOutPhoto: capturedPhoto,
            checkOutLocation: { lat: userLocation.latitude, lng: userLocation.longitude },
            checkOutDistance: distance,
            checkOutFaceScore: faceScore,
          })

          const updatedRecord = { ...todayRecord, checkOut: checkOutTime }
          setTodayRecord(updatedRecord)

          addNotification({
            userId: user.id,
            title: "Check-out Berhasil",
            message: `Anda berhasil check-out pada ${checkOutTime}`,
            type: "success",
            read: false,
            createdAt: new Date().toISOString(),
          })

          setAlert({
            type: "success",
            message: `Berhasil check-out pada ${checkOutTime}! Foto dikirim ke admin.`,
          })
        }

        // Refresh recent attendance
        const records = getAttendanceByUser(user.id).slice(-5).reverse()
        setRecentAttendance(records)
      }

      setCapturedPhoto(null)
      setSelectedMode(null)
    } catch (error) {
      console.error("[v0] Confirmation error:", error)
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const processCheckIn = async (imageData: string) => {
    // Call API to save check-in
    console.log("[v0] Processing check-in with photo and GPS")
    // In real app: await fetch('/api/attendance/check-in', {...})
  }

  const processCheckOut = async (imageData: string) => {
    // Call API to save check-out
    console.log("[v0] Processing check-out with photo and GPS")
    // In real app: await fetch('/api/attendance/check-out', {...})
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (showCamera) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <CameraCapture onCapture={handlePhotoCapture} onCancel={() => setShowCamera(false)} />
      </div>
    )
  }

  if (!user || !office) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 safe-area">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary/95 to-accent shadow-xl border-b border-primary/20">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">📱 Presensi Online</h1>
                <p className="text-white/80 text-sm">SMKN 1 Mejayan - GPS + AI Face Recognition</p>
              </div>
              <div className="flex items-center gap-2">
                <NotificationCenter />
                <Button
                  variant="outline"
                  className="bg-red-500/20 border-red-400/50 text-white hover:bg-red-500/30"
                  onClick={() => {
                    setCurrentUser(null)
                    router.push("/login")
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isCheckedIn = todayRecord && !todayRecord.checkOut
  const checkInTime = todayRecord ? new Date(`2000-01-01 ${todayRecord.checkIn}`) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/5">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary to-accent shadow-lg border-b border-primary/20">
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Presensi SMKN 1 Mejayan</h1>
              <p className="text-white/80 text-sm">
                {user?.name} • {user?.employeeId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  localStorage.clear()
                  router.push("/login")
                }}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto p-4 space-y-6 pb-8">
        {/* Tabs for different views */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-primary/20">
            <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              📝 Presensi
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              🗺️ Peta Lokasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6 mt-6">
            {/* Time Display Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="text-center py-6 space-y-2">
                  <div className="text-6xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatTime(currentTime)}
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">{formatDate(currentTime)}</p>
                </div>

                {isCheckedIn && checkInTime && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 mt-4">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                      ✓ Anda sudah check-in pada {formatTime(checkInTime)}
                    </AlertDescription>
                  </Alert>
                )}

                {alert && (
                  <Alert
                    variant={alert.type === "error" ? "destructive" : "default"}
                    className={
                      alert.type === "success"
                        ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 mt-4"
                        : "mt-4"
                    }
                  >
                    {alert.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className={alert.type === "success" ? "text-green-700 dark:text-green-300" : ""}>
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Location Status */}
            {userLocation && (
              <LocationStatus
                userLocation={userLocation}
                officeLocation={office}
                officeName={office.name}
                isWithinRadius={isWithinRadius(userLocation, office, office.radiusMeters)}
                radiusMeters={office.radiusMeters}
                distance={calculateDistance(userLocation, office)}
              />
            )}

            {locationError && (
              <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950">
                <MapPin className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            {/* Action Button */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
              <CardContent className="p-6 relative">
                <Button
                  size="lg"
                  className="w-full h-16 text-lg gap-2 gradient-bg text-white font-bold hover:shadow-2xl transition-all transform hover:scale-105"
                  onClick={handleCameraOpen}
                  disabled={isProcessing || !userLocation || !isWithinRadius(userLocation, office, office.radiusMeters)}
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="h-5 w-5" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      {isCheckedIn ? "📸 Check-Out Sekarang" : "📸 Check-In Sekarang"}
                    </>
                  )}
                </Button>

                {(!userLocation || !isWithinRadius(userLocation, office, office.radiusMeters)) && (
                  <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
                    {!userLocation
                      ? "⏳ Menunggu lokasi GPS..."
                      : "📍 Anda harus berada dalam radius sekolah untuk presensi"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/20">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <History className="h-5 w-5" />
                  Riwayat Presensi Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentAttendance.map((record, index) => (
                    <div key={record.id} className="group">
                      {index > 0 && <Separator className="my-3" />}
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {new Date(record.date).toLocaleDateString("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                              <Clock className="h-3 w-3" />📍 {record.checkIn}
                            </span>
                            {record.checkOut && (
                              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                <Clock className="h-3 w-3" />📍 {record.checkOut}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"
                          }
                        >
                          {record.status === "present" ? "✓ Hadir" : record.status === "late" ? "⏰ Terlambat" : "✗ Tidak Hadir"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6 mt-6">
            {/* Map Component */}
            <AttendanceMap officeLocation={office} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mode Selector Modal */}
      {showModeSelector && <AttendanceModSelector onSelectMode={handleModeSelected} isCheckedIn={isCheckedIn} />}

      {/* Photo Confirmation Modal */}
      {showPhotoConfirm && capturedPhoto && (
        <PhotoConfirmation
          photo={capturedPhoto}
          attendanceType={selectedMode || "check-in"}
          faceScore={faceScore}
          distance={calculateDistance(userLocation!, office)}
          radiusMeters={office.radiusMeters}
          onConfirm={handlePhotoConfirm}
          onRetake={() => {
            setShowPhotoConfirm(false)
            setCapturedPhoto(null)
            setShowCamera(true)
          }}
          isProcessing={isProcessing}
        />
      )}
    </div>
  )
}
