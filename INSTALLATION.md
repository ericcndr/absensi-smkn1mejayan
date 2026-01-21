# Panduan Instalasi SMKN 1 Mejayan GPS AI Attendance App

## Daftar File Aplikasi

### 📁 Struktur Folder Project

```
project-root/
├── app/
│   ├── page.tsx              # Halaman Home
│   ├── layout.tsx            # Root Layout (PWA config)
│   ├── globals.css           # Global Styles & Design System
│   ├── login/
│   │   └── page.tsx          # Login Page
│   ├── attendance/
│   │   └── page.tsx          # Employee Attendance Page
│   └── admin/
│       ├── page.tsx          # Admin Dashboard
│       └── loading.tsx       # Loading Page
├── components/
│   ├── camera-capture.tsx    # Camera Component
│   ├── location-status.tsx   # Location Status Display
│   ├── attendance-chart.tsx  # Attendance Chart
│   ├── export-dialog.tsx     # Export Feature
│   ├── notification-center.tsx # Notifications
│   ├── pwa-install-prompt.tsx # PWA Install Prompt
│   ├── admin-settings.tsx    # Admin Settings Panel
│   └── ui/                   # Shadcn UI Components
├── lib/
│   ├── storage.ts            # LocalStorage Management (with flexible settings)
│   ├── gps.ts                # GPS Utilities
│   ├── face-detection.ts     # AI Face Recognition
│   ├── export.ts             # Export Utilities
│   ├── mobile-optimization.ts # Mobile Optimizations
│   └── utils.ts              # Utility Functions
├── public/
│   ├── manifest.json         # PWA Manifest
│   ├── browserconfig.xml     # Browser Config
│   └── sw.js                 # Service Worker
├── scripts/
│   ├── 001-create-tables.sql # Database Schema (optional)
│   └── 002-seed-data.sql     # Sample Data (optional)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript Config
├── next.config.mjs           # Next.js Config
└── INSTALLATION.md           # This file
```

## Login Credentials

```
KARYAWAN/SISWA:
- Email: budi@company.com
- Password: password123

ADMIN:
- Email: admin@company.com
- Password: password123
```

## Fitur Utama

✅ **GPS Tracking Real-time**
- Jarak hingga 1km dari lokasi sekolah (dapat diatur admin)
- Koordinat real-time GPS
- Validasi lokasi otomatis

✅ **Face Recognition AI**
- AI Face Detection menggunakan teknologi computer vision
- Anti-Spoofing: Mendeteksi foto palsu/layar
- Confidence score untuk setiap deteksi

✅ **Check-in/Check-out**
- Foto selfie dengan timestamp
- Status otomatis (Hadir/Terlambat)
- Riwayat presensi lengkap

✅ **Admin Dashboard**
- Statistik real-time (Hadir/Terlambat/Tidak Hadir)
- Filter pencarian dan departemen
- Export laporan (CSV/Excel/PDF)
- Tab Pengaturan untuk mengatur radius GPS

✅ **Notification System**
- Notifikasi check-in/check-out
- Notification Center di UI

✅ **Progressive Web App (PWA)**
- Install di home screen Android/iOS
- Akses offline
- Push notifications
- Full responsive design

## Cara Menggunakan

### 1. Login
- Buka aplikasi
- Gunakan email dan password di atas
- Klik Login

### 2. Employee Check-in
- Buka halaman Presensi
- Kamera akan mendeteksi lokasi GPS secara otomatis
- Klik tombol "Check-in Sekarang"
- Ambil foto selfie
- AI akan memverifikasi wajah Anda

### 3. Admin Dashboard
- Login sebagai admin
- Lihat statistik presensi hari ini
- Gunakan filter untuk pencarian
- Export laporan
- **Atur Radius GPS: Klik tab "⚙️ Pengaturan"**

### 4. Pengaturan Radius GPS (Admin)
- Buka Admin Dashboard
- Klik tab "⚙️ Pengaturan"
- Atur nilai radius (dalam meter)
- Masukkan koordinat GPS kantor (Latitude/Longitude)
- Klik "Simpan Pengaturan"
- Pengaturan langsung berlaku untuk semua user

## Cara Menemukan Koordinat GPS

### Metode 1: Google Maps
1. Buka Google Maps
2. Cari lokasi kantor/sekolah Anda
3. Klik kanan pada marker
4. Salin koordinat (contoh: -7.641, 111.5088)

### Metode 2: Smartphone GPS
1. Buka Google Maps di smartphone
2. Tahan lama pada lokasi kantor
3. Koordinat akan muncul di bawah
4. Copy nilai latitude dan longitude

### Saat ini:
- **Lokasi:** Area Sawah/Kebun, Pandean, Mejayan
- **Latitude:** -7.641
- **Longitude:** 111.5088
- **Radius:** 1000 meter (1km)

## Install PWA (Mobile App)

### Android (Chrome)
1. Buka aplikasi di Chrome
2. Klik menu (⋮) → "Install app"
3. Konfirmasi instalasi
4. Aplikasi akan tersimpan di home screen

### iOS (Safari)
1. Buka aplikasi di Safari
2. Klik tombol Share (↗️)
3. Pilih "Add to Home Screen"
4. Beri nama (atau gunakan nama default)
5. Aplikasi tersimpan di home screen

## Troubleshooting

### GPS Tidak Terdeteksi
- ✅ Aktifkan Location/GPS di smartphone
- ✅ Berikan permission GPS ke aplikasi
- ✅ Pastikan signal kuat (outdoor lebih baik)

### Wajah Tidak Terdeteksi
- ✅ Pencahayaan harus cukup
- ✅ Posisikan wajah di tengah layar
- ✅ Gunakan wajah asli (bukan foto)

### Foto Palsu Terdeteksi
- ✅ Gunakan wajah asli (live face)
- ✅ Jangan menggunakan foto dari kertas
- ✅ Jangan menggunakan foto di layar

### Berada di Luar Radius
- ✅ Pastikan berada dalam radius GPS yang ditentukan
- ✅ Minta admin untuk menambah radius jika perlu
- ✅ Cek koordinat GPS di halaman presensi

## File Penting

| File | Deskripsi |
|------|-----------|
| `app/attendance/page.tsx` | Halaman presensi utama |
| `components/admin-settings.tsx` | Komponen pengaturan radius (NEW) |
| `app/admin/page.tsx` | Dashboard admin dengan tab settings |
| `lib/storage.ts` | Pengelolaan settings flexible |
| `public/manifest.json` | Konfigurasi PWA |
| `app/layout.tsx` | PWA setup dan metadata |

## Features Detail

### Flexible Radius System
- Admin dapat mengatur radius melalui dashboard
- Settings tersimpan di localStorage
- Perubahan langsung berlaku untuk semua pengguna
- Support radius 100m hingga 10km+

### Face Recognition AI
- Deteksi wajah dengan akurasi tinggi
- Anti-spoofing dengan liveness detection
- Confidence score untuk verifikasi kualitas

### GPS Tracking
- Real-time location tracking
- Kalkulasi distance otomatis
- Validasi radius dengan presisi

### Export Laporan
- Format: CSV, Excel, PDF
- Filter berdasarkan tanggal dan department
- Include semua detail (nama, waktu, lokasi, AI score)

## Support

Untuk bantuan lebih lanjut:
1. Periksa localStorage di browser (DevTools → Application → Local Storage)
2. Verifikasi GPS dan permission di smartphone
3. Test dengan login credentials yang sudah disediakan
4. Cek console untuk error messages

---

**Aplikasi Dibuat Dengan:**
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS + Shadcn/UI
- Progressive Web App (PWA)
- Face.js untuk AI Detection
- Geolocation API untuk GPS

**Last Updated:** 2024
