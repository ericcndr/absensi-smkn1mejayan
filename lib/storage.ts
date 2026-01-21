interface User {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  role: "employee" | "admin"
  profilePhoto?: string
}

interface AttendanceRecord {
  id: string
  userId: string
  date: string
  checkIn: string
  checkInPhoto: string
  checkInLocation: { lat: number; lng: number }
  checkInDistance: number
  checkInFaceScore: number
  checkOut?: string
  checkOutPhoto?: string
  checkOutLocation?: { lat: number; lng: number }
  checkOutDistance?: number
  checkOutFaceScore?: number
  status: "present" | "late" | "absent"
}

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

interface AppSettings {
  radiusMeters: number
  officeLatitude: number
  officeLongitude: number
  officeName: string
  officeAddress: string
}

// Initialize default data
export function initializeDefaultData() {
  if (typeof window === "undefined") return

  // Check if data already exists
  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Budi Santoso",
        email: "budi@smkn1mejayan.sch.id",
        employeeId: "SIS001",
        department: "Kelas X",
        role: "employee",
      },
      {
        id: "2",
        name: "Admin SMKN 1",
        email: "admin@smkn1mejayan.sch.id",
        employeeId: "ADMIN001",
        department: "Administrasi",
        role: "admin",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem("attendance")) {
    localStorage.setItem("attendance", JSON.stringify([]))
  }

  if (!localStorage.getItem("notifications")) {
    localStorage.setItem("notifications", JSON.stringify([]))
  }

  if (!localStorage.getItem("settings")) {
    const defaultSettings: AppSettings = {
      radiusMeters: 1000,
      officeLatitude: -7.641,
      officeLongitude: 111.5088,
      officeName: "SMKN 1 Mejayan",
      officeAddress: "Area Sawah/Kebun, Pandean, Mejayan, Kabupaten Madiun, Jawa Timur 63153",
    }
    localStorage.setItem("settings", JSON.stringify(defaultSettings))
  }
}

// User management
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("users")
  return data ? JSON.parse(data) : []
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("currentUser")
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

// Attendance management
export function getAttendanceRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("attendance")
  return data ? JSON.parse(data) : []
}

export function getAttendanceByUser(userId: string): AttendanceRecord[] {
  return getAttendanceRecords().filter((r) => r.userId === userId)
}

export function getAttendanceByDate(date: string): AttendanceRecord[] {
  return getAttendanceRecords().filter((r) => r.date === date)
}

export function getTodayAttendanceForUser(userId: string): AttendanceRecord | null {
  const today = new Date().toISOString().split("T")[0]
  const records = getAttendanceRecords()
  return records.find((r) => r.userId === userId && r.date === today) || null
}

export function addAttendanceRecord(record: Omit<AttendanceRecord, "id">): AttendanceRecord {
  const records = getAttendanceRecords()
  const newRecord: AttendanceRecord = {
    ...record,
    id: Date.now().toString(),
  }
  records.push(newRecord)
  localStorage.setItem("attendance", JSON.stringify(records))
  return newRecord
}

export function updateAttendanceRecord(id: string, updates: Partial<AttendanceRecord>) {
  const records = getAttendanceRecords()
  const index = records.findIndex((r) => r.id === id)
  if (index !== -1) {
    records[index] = { ...records[index], ...updates }
    localStorage.setItem("attendance", JSON.stringify(records))
  }
}

// Notification management
export function getNotifications(userId: string): Notification[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("notifications")
  const all: Notification[] = data ? JSON.parse(data) : []
  return all.filter((n) => n.userId === userId)
}

export function addNotification(notification: Omit<Notification, "id">): Notification {
  const notifications = localStorage.getItem("notifications")
  const all: Notification[] = notifications ? JSON.parse(notifications) : []
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
  }
  all.push(newNotification)
  localStorage.setItem("notifications", JSON.stringify(all))
  return newNotification
}

export function markNotificationAsRead(id: string) {
  const notifications = localStorage.getItem("notifications")
  const all: Notification[] = notifications ? JSON.parse(notifications) : []
  const index = all.findIndex((n) => n.id === id)
  if (index !== -1) {
    all[index].read = true
    localStorage.setItem("notifications", JSON.stringify(all))
  }
}

// Settings management
export function getSettings(): AppSettings {
  if (typeof window === "undefined") return {
    radiusMeters: 1000,
    officeLatitude: -7.641,
    officeLongitude: 111.5088,
    officeName: "SMKN 1 Mejayan",
    officeAddress: "Area Sawah/Kebun, Pandean, Mejayan, Kabupaten Madiun, Jawa Timur 63153",
  }
  const data = localStorage.getItem("settings")
  return data ? JSON.parse(data) : {
    radiusMeters: 1000,
    officeLatitude: -7.641,
    officeLongitude: 111.5088,
    officeName: "SMKN 1 Mejayan",
    officeAddress: "Area Sawah/Kebun, Pandean, Mejayan, Kabupaten Madiun, Jawa Timur 63153",
  }
}

export function updateSettings(updates: Partial<AppSettings>) {
  if (typeof window === "undefined") return
  const current = getSettings()
  const updated = { ...current, ...updates }
  localStorage.setItem("settings", JSON.stringify(updated))
}

// Stats calculation
export function calculateStats() {
  const users = getUsers().filter((u) => u.role === "employee")
  const today = new Date().toISOString().split("T")[0]
  const todayRecords = getAttendanceByDate(today)

  const presentToday = todayRecords.filter((r) => r.status === "present").length
  const lateToday = todayRecords.filter((r) => r.status === "late").length
  const absentToday = users.length - todayRecords.length

  return {
    totalEmployees: users.length,
    presentToday,
    lateToday,
    absentToday,
    attendanceRate: users.length > 0 ? ((presentToday + lateToday) / users.length) * 100 : 0,
  }
}
