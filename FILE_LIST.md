# 📋 Daftar Lengkap File Aplikasi SMKN 1 Mejayan

## Quick Overview
Aplikasi Presensi GPS AI untuk SMKN 1 Mejayan dengan sistem manajemen radius yang flexible.

---

## 📄 CORE PAGES

### 1. `app/page.tsx`
**Fungsi:** Halaman home/landing
**Konten:**
- Welcome screen
- Link ke login
- Informasi aplikasi

### 2. `app/login/page.tsx`
**Fungsi:** Halaman login aplikasi
**Fitur:**
- Input email & password
- Validasi credentials
- Redirect ke attendance (employee) atau admin
- Demo credentials built-in

**Default Users:**
```
Employee: budi@company.com / password123
Admin:    admin@company.com / password123
```

### 3. `app/attendance/page.tsx`
**Fungsi:** Halaman utama presensi karyawan/siswa
**Fitur:**
- GPS tracking real-time
- Camera capture untuk foto selfie
- Face recognition AI verification
- Check-in/Check-out tracking
- Riwayat presensi terbaru
- Status validasi: Hadir/Terlambat/Tidak Hadir
- **DYNAMIC:** Radius dapat diatur dari admin settings

**Key Features:**
- Menggunakan `getSettings()` untuk radius flexible
- Geolocation API untuk GPS
- Face detection dengan confidence scoring
- Timestamp otomatis

### 4. `app/admin/page.tsx`
**Fungsi:** Dashboard admin lengkap
**Fitur:**
- Statistik presensi real-time (5 cards)
- Filter pencarian dan departemen
- Tampilan detail presensi per user
- Tabs: Hari Ini, Riwayat, Peserta Didik, **Pengaturan GPS** (NEW)
- Export laporan dialog
- Notification center

**Tabs yang Tersedia:**
- ✅ Hari Ini - Presensi hari ini dengan filter
- 📊 Riwayat - Riwayat presensi periode
- 👥 Peserta Didik - Manajemen user
- ⚙️ Pengaturan - **BARU: Atur radius dan lokasi GPS**

### 5. `app/admin/loading.tsx`
**Fungsi:** Loading skeleton untuk admin page
**Konten:** Spinner component saat loading

### 6. `app/layout.tsx`
**Fungsi:** Root layout untuk seluruh aplikasi
**Konten:**
- HTML metadata (PWA config)
- Viewport settings untuk mobile
- Font imports (Geist Sans/Mono)
- Service Worker registration
- PWA manifest link
- Global providers

**PWA Support:**
- Manifest JSON link
- Apple mobile meta tags
- Viewport configuration
- Theme color
- Service Worker


---

## 🎨 COMPONENTS

### UI Components (shadcn/ui)
Located in `components/ui/`:
- `accordion.tsx`
- `alert.tsx`
- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `input.tsx`
- `label.tsx`
- `separator.tsx`
- `spinner.tsx`
- `tabs.tsx`
- `select.tsx`
- dll...

### Custom Components

#### 1. `components/camera-capture.tsx`
**Fungsi:** Komponen kamera untuk capture foto selfie
**Fitur:**
- Access webcam browser
- Preview live camera feed
- Snap photo button
- Cancel option
- Mobile optimized
- CORS handling untuk image

**Props:**
```typescript
onCapture: (imageData: string) => void
onCancel: () => void
```

#### 2. `components/location-status.tsx`
**Fungsi:** Menampilkan status lokasi GPS
**Fitur:**
- Tampil lokasi user vs lokasi kantor
- Jarak dalam meter/km
- Status within radius (hijau/merah)
- Koordinat display
- Loading state

**Props:**
```typescript
userLocation: Coordinates
officeLocation: any
officeName: string
isWithinRadius: boolean
radiusMeters: number
distance: number
```

#### 3. `components/attendance-chart.tsx`
**Fungsi:** Grafik statistik presensi
**Fitur:**
- Chart visualization
- Daily/Weekly/Monthly stats
- Graphical representation

#### 4. `components/export-dialog.tsx`
**Fungsi:** Dialog untuk export laporan
**Fitur:**
- Format: CSV, Excel, PDF
- Filter berdasarkan tanggal
- Download button
- Dialog responsive

**Props:**
```typescript
data: AttendanceRecord[]
```

#### 5. `components/notification-center.tsx`
**Fungsi:** Pusat notifikasi aplikasi
**Fitur:**
- Bell icon dengan badge count
- Dropdown dengan notification list
- Mark as read
- Notification types: success/error/info/warning
- Delete notification
- Real-time updates

#### 6. `components/pwa-install-prompt.tsx`
**Fungsi:** Menampilkan prompt install PWA
**Fitur:**
- Auto-detect PWA installability
- Install button
- iOS instructions untuk Safari
- Android Chrome install prompt

#### 7. `components/admin-settings.tsx` ⭐ NEW
**Fungsi:** Panel pengaturan GPS radius untuk admin
**Fitur:**
- Input radius (meter) dengan preview km
- Edit nama kantor
- Edit alamat lengkap
- Input latitude/longitude
- Save button dengan validation
- Success/error messages
- Help text untuk menemukan koordinat GPS

**Key Fields:**
```typescript
- officeName: string (nama kantor/sekolah)
- officeAddress: string (alamat lengkap)
- radiusMeters: number (jarak dalam meter)
- officeLatitude: number (garis lintang)
- officeLongitude: number (garis bujur)
```

#### 8. `components/theme-provider.tsx`
**Fungsi:** Theme provider untuk dark/light mode
**Fitur:** Next.js theme provider setup


---

## 📚 LIBRARIES & UTILITIES

### 1. `lib/storage.ts` ⭐ UPDATED
**Fungsi:** LocalStorage management & data persistence
**Exports:**

```typescript
// Interfaces
interface User
interface AttendanceRecord
interface Notification
interface AppSettings ⭐ NEW

// User Management
- getUsers()
- getUserByEmail(email)
- getCurrentUser()
- setCurrentUser(user)

// Attendance Management
- getAttendanceRecords()
- getAttendanceByUser(userId)
- getAttendanceByDate(date)
- getTodayAttendanceForUser(userId)
- addAttendanceRecord(record)
- updateAttendanceRecord(id, updates)

// Notification Management
- getNotifications(userId)
- addNotification(notification)
- markNotificationAsRead(id)

// Settings Management ⭐ NEW
- getSettings(): AppSettings
- updateSettings(updates: Partial<AppSettings>)

// Utils
- calculateStats()
- initializeDefaultData()
```

**Default Settings:**
```json
{
  "radiusMeters": 1000,
  "officeLatitude": -7.641,
  "officeLongitude": 111.5088,
  "officeName": "SMKN 1 Mejayan",
  "officeAddress": "Area Sawah/Kebun, Pandean, Mejayan, Kabupaten Madiun, Jawa Timur 63153"
}
```

### 2. `lib/gps.ts`
**Fungsi:** GPS utilities dan geolocation
**Exports:**

```typescript
interface Coordinates {
  latitude: number
  longitude: number
}

export const getCurrentLocation()
export const calculateDistance(from, to)
export const isWithinRadius(userLoc, officeLoc, radiusMeters)
export const getAddressFromCoordinates(lat, lng)
```

### 3. `lib/face-detection.ts`
**Fungsi:** AI Face Recognition dan anti-spoofing
**Features:**
- Face detection menggunakan Face.js library
- Liveness detection (anti-spoofing)
- Confidence scoring (0-100%)
- Spoofing detection

**Exports:**
```typescript
export async function detectFaceAndSpoofing(imageData: string)
// Returns:
{
  isValid: boolean
  isSpoofing: boolean
  confidence: number (0-100)
  message: string
}
```

### 4. `lib/export.ts`
**Fungsi:** Export data ke berbagai format
**Formats:**
- CSV (comma-separated)
- Excel (.xlsx)
- PDF (.pdf)

**Exports:**
```typescript
export function exportToCSV(data, filename)
export function exportToExcel(data, filename)
export function exportToPDF(data, filename)
```

### 5. `lib/mobile-optimization.ts`
**Fungsi:** Optimasi untuk perangkat mobile
**Features:**
- Notch detection & safe areas
- Viewport size detection
- Touch optimization
- Event prevention (zoom, text selection)
- Full screen mode handling

**Exports:**
```typescript
export function disableZoom()
export function getWindowSize()
export function getSafeAreaInsets()
export function preventTextSelection()
```

### 6. `lib/utils.ts`
**Fungsi:** Utility functions umum
**Content:**
- `cn()` - Class name merger (shadcn utility)
- Helper functions lainnya


---

## 🎨 STYLING

### `app/globals.css`
**Konten:**
- Tailwind CSS v4 imports
- Custom CSS variables (design tokens)
- Global styles
- Color system setup
- Animation definitions
- Typography setup

**Design Tokens:**
```css
--primary: RGB dari primary color (biru gelap)
--accent: RGB dari accent color (emas/amber)
--background: warna background
--foreground: warna text
--muted-background: warna muted bg
--muted-foreground: warna muted text
--radius: border radius (default 8px)
```

**Animations:**
- `pulse` - Pulsing effect
- `shimmer` - Shimmer loading effect
- `float` - Floating animation
- `slide-up` - Slide up animation


---

## 📱 PWA CONFIGURATION

### 1. `public/manifest.json`
**Fungsi:** PWA manifest file
**Content:**
- App name, description
- Icons (192x192, 512x512)
- Display mode: standalone
- Theme color: primary color
- Start URL: /
- Orientation: portrait-primary
- Categories: productivity

### 2. `public/sw.js`
**Fungsi:** Service Worker untuk offline support
**Features:**
- Cache API endpoints
- Offline fallback
- Background sync
- Push notifications support

### 3. `public/browserconfig.xml`
**Fungsi:** Windows tile configuration
**Content:**
- Tile color
- App branding untuk Windows


---

## 📦 PROJECT CONFIG FILES

### `package.json`
**Dependencies:**
- next (Next.js 16)
- react 19
- typescript
- tailwindcss v4
- lucide-react (icons)
- @supabase/ssr (optional)
- Tidak ada ORM karena menggunakan localStorage

### `tsconfig.json`
**Config:**
- TypeScript strict mode
- Path aliases (@/)
- React JSX transform

### `next.config.mjs`
**Config:**
- Turbopack enabled (default)
- PWA plugin
- Image optimization

### `tailwind.config.ts`
**Config:** (Jika ada)
- Custom theme colors
- Font configuration
- Dark mode setup


---

## 📊 DATA FLOW

### Login Flow
```
Login Page → Validate Credentials → getCurrentUser() → 
  If Admin → Admin Dashboard
  If Employee → Attendance Page
```

### Attendance Flow
```
Attendance Page → getSettings() → GPS Check → 
Camera → Face Detection → Save to Storage → 
Success Notification
```

### Admin Settings Flow
```
Admin → Settings Tab → Edit Settings → 
updateSettings() → localStorage updated → 
All users get new radius instantly
```

### GPS Radius Checking
```
Attendance Page loads → 
  1. Fetch current location (Geolocation API)
  2. Load settings with getSettings()
  3. Calculate distance using calculateDistance()
  4. Check if isWithinRadius()
  5. Enable/disable check-in button accordingly
```


---

## 🔐 SECURITY NOTES

- ✅ Client-side only (no server vulnerabilities)
- ✅ localStorage for demo (no sensitive data)
- ✅ Password hashing mock (untuk production, use bcrypt)
- ✅ Face detection on client (tidak ada server upload)
- ✅ GPS data disimpan local saja

**For Production:**
- Gunakan Supabase atau database server
- Implement proper authentication
- Hash password dengan bcrypt
- Use HTTPS untuk upload foto
- Implement proper authorization


---

## 🚀 DEPLOYMENT

### Build
```bash
npm run build
```

### Start
```bash
npm run start
```

### Dev
```bash
npm run dev
```

### Deploy to Vercel
- Push ke GitHub
- Connect dengan Vercel
- Auto-deploy on push


---

## 📱 MOBILE SUPPORT

### Android
- ✅ Chrome browser support
- ✅ PWA installable
- ✅ Camera access
- ✅ GPS access
- ✅ Service Worker offline

### iOS
- ✅ Safari browser support
- ✅ Add to Home Screen
- ✅ Camera access
- ✅ GPS access
- ⚠️ Limited offline (PWA limitations iOS)


---

## 📝 NOTES

1. **Default Credentials sudah built-in di storage.ts**
   - Employee test: budi@company.com
   - Admin test: admin@company.com

2. **Radius adalah FLEXIBLE**
   - Default: 1000 meter
   - Dapat diubah via Admin Settings
   - Real-time applied

3. **Face Detection AI**
   - Run on client-side
   - No server upload
   - Privacy protected

4. **GPS Coordinates**
   - Lokasi: Area Sawah/Kebun, Pandean, Mejayan
   - Latitude: -7.641
   - Longitude: 111.5088
   - Dapat diubah via Admin Settings

5. **Progressive Web App**
   - Works offline (limited)
   - Install ke home screen
   - Push notifications ready

---

## ✅ CHECKLIST SEBELUM DEPLOY

- [ ] Test login dengan kedua user
- [ ] Test attendance check-in/check-out
- [ ] Test admin dashboard & filters
- [ ] Test GPS (harus device dengan GPS)
- [ ] Test camera permissions
- [ ] Test radius settings (ubah dari admin)
- [ ] Test export laporan
- [ ] Test notifications
- [ ] Test PWA install (Android/iOS)
- [ ] Test offline mode
- [ ] Test dark/light mode
- [ ] Test responsive di berbagai device

---

**Aplikasi Siap Digunakan!** 🎉
