"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUsers, getAttendanceByDate, calculateStats, getNotifications } from "@/lib/storage"
import { Spinner } from "@/components/ui/spinner"
import { Users, Calendar, TrendingUp, Clock, MapPin, Camera, Search, Filter, CheckCircle, XCircle, LogOut, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ExportDialog } from "@/components/export-dialog"
import { NotificationCenter } from "@/components/notification-center"
import { AdminSettings } from "@/components/admin-settings"

interface AttendanceRecord {
  id: string
  user: {
    id: string
    name: string
    employeeId: string
    department: string
  }
  date: string
  checkIn: string
  checkOut: string | null
  status: "present" | "late" | "absent"
  location: string
  distance: number
  faceScore: number
}

interface Stats {
  totalEmployees: number
  presentToday: number
  lateToday: number
  absentToday: number
  attendanceRate: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedDate] = useState(new Date().toISOString().split("T")[0])

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "admin") {
      router.push("/attendance")
      return
    }
    setCurrentUser(user)

    // Load stats
    setStats(calculateStats())

    // Load users
    const allUsers = getUsers().filter((u) => u.role === "employee")
    setUsers(allUsers)

    // Load today's attendance with user info
    const records = getAttendanceByDate(selectedDate).map((record) => {
      const user = allUsers.find((u) => u.id === record.userId)
      return {
        ...record,
        user: user || { name: "Unknown", employeeId: "N/A", department: "N/A" },
        location: "Kantor Randualas",
        distance: record.checkInDistance,
        faceScore: record.checkInFaceScore,
      }
    })
    setAttendanceRecords(records)
  }, [router, selectedDate])

  const departments = ["all", ...Array.from(new Set(users.map((u) => u.department)))]

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || record.user.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "late":
        return "secondary"
      case "absent":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Hadir"
      case "late":
        return "Terlambat"
      case "absent":
        return "Tidak Hadir"
      default:
        return status
    }
  }

  if (!currentUser || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary/95 to-accent shadow-xl border-b border-primary/20">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">📊 Dashboard Admin</h1>
              <p className="text-white/80 text-sm">SMKN 1 Mejayan - Monitor Presensi</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Calendar className="h-4 w-4 mr-2" />
                Laporan
              </Button>
              <ExportDialog data={filteredRecords} />
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform">
            <CardHeader className="pb-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Total Peserta Didik
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{stats.totalEmployees}</div>
                <Users className="h-8 w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Hadir Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.presentToday}</div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">Terlambat</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.lateToday}</div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">Tidak Hadir</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-700 dark:text-red-300">{stats.absentToday}</div>
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 transform bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Tingkat Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.attendanceRate}%</div>
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="bg-muted/50 border border-primary/20">
            <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Hari Ini
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Riwayat
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Peserta Didik
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              ⚙️ Pengaturan
            </TabsTrigger>
            <TabsTrigger value="datacenter" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              💾 Pusat Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-primary">Presensi Hari Ini</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama atau ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-64 border-primary/20 focus:border-primary"
                      />
                    </div>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full sm:w-40 border-primary/20">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Departemen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        {departments.slice(1).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredRecords.map((record, index) => (
                    <div key={record.id} className="group">
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-all">
                        <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary transition-all">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                            {record.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-foreground">{record.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.user.employeeId} • {record.user.department}
                              </p>
                            </div>
                            <Badge variant={getStatusColor(record.status)} className="font-bold text-white">
                              {getStatusText(record.status) === "Hadir" && "✓ Hadir"}
                              {getStatusText(record.status) === "Terlambat" && "⏰ Terlambat"}
                              {getStatusText(record.status) === "Tidak Hadir" && "✗ Tidak Hadir"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg font-medium">
                              <Clock className="h-4 w-4" />
                              <span>📍 {record.checkIn}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg font-medium">
                              <Clock className="h-4 w-4" />
                              <span>📍 {record.checkOut || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg font-medium">
                              <MapPin className="h-4 w-4" />
                              <span>{Math.round(record.distance)}m</span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-2 rounded-lg font-medium">
                              <Camera className="h-4 w-4" />
                              <span>AI: {record.faceScore}%</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground font-medium">
                            📍 Area Sawah/Kebun, Pandean, Mejayan
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredRecords.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground text-lg">Tidak ada data presensi ditemukan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-primary">Riwayat Presensi</CardTitle>
                <CardDescription>Lihat data presensi periode sebelumnya dengan filter lengkap</CardDescription>
              </CardHeader>
              <CardContent className="pt-12">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-16 w-16 text-primary/20 mb-4" />
                  <p className="text-lg font-bold mb-2 text-foreground">Fitur Riwayat Presensi</p>
                  <p className="text-muted-foreground max-w-sm">
                    Kelola dan analisis data presensi karyawan dari periode sebelumnya dengan filter tanggal dan
                    departemen yang lengkap
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-primary">Manajemen Peserta Didik</CardTitle>
                <CardDescription>Kelola data peserta didik dan hak akses presensi</CardDescription>
              </CardHeader>
              <CardContent className="pt-12">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-16 w-16 text-primary/20 mb-4" />
                  <p className="text-lg font-bold mb-2 text-foreground">Manajemen Peserta Didik</p>
                  <p className="text-muted-foreground max-w-sm">
                    Tambah, edit, atau hapus data peserta didik. Kelola kelas, jurusan, dan hak akses presensi dengan
                    mudah
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>

          <TabsContent value="datacenter" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-primary flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Pusat Data Sistem
                </CardTitle>
                <CardDescription>Kelola dan pantau semua data presensi, notifikasi, dan pengaturan sistem</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Data Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Peserta Didik</p>
                        <p className="text-3xl font-bold text-primary">{users.length}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Presensi Hari Ini</p>
                        <p className="text-3xl font-bold text-green-600">{filteredRecords.length}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Notifikasi Aktif</p>
                        <p className="text-3xl font-bold text-blue-600">{getNotifications(currentUser?.id || "").length}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Notifications */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Notifikasi Terbaru
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getNotifications(currentUser?.id || "").slice(-5).reverse().map((notif) => (
                        <div key={notif.id} className="p-3 rounded-lg bg-muted/50 border border-primary/10">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm text-foreground">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                            </div>
                            <Badge variant={notif.type === "success" ? "default" : notif.type === "error" ? "destructive" : "outline"} className="ml-2">
                              {notif.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Storage Info */}
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <span className="font-semibold">💾 Penyimpanan Data:</span> Semua data presensi disimpan secara lokal di browser Anda menggunakan localStorage. Data otomatis tersinkronisasi untuk semua admin.
                    </p>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => {
                        const backup = {
                          timestamp: new Date().toISOString(),
                          data: {
                            users: getUsers(),
                            attendance: getAttendanceByDate(new Date().toISOString().split("T")[0]),
                            notifications: getNotifications(currentUser?.id || ""),
                          }
                        }
                        const dataStr = JSON.stringify(backup, null, 2)
                        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
                        const exportFileDefaultName = `backup-${new Date().toISOString().split("T")[0]}.json`
                        const linkElement = document.createElement('a')
                        linkElement.setAttribute('href', dataUri)
                        linkElement.setAttribute('download', exportFileDefaultName)
                        linkElement.click()
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Backup Data
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin mengosongkan semua data? Tindakan ini tidak dapat dibatalkan.")) {
                          localStorage.clear()
                          router.push("/login")
                        }
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Hapus Semua Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
