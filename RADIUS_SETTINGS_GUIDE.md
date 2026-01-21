# 🎯 Panduan Lengkap: Flexible GPS Radius Settings

## Apa itu Radius GPS?

**Radius GPS** adalah jarak maksimal (dalam meter) dari lokasi kantor/sekolah di mana karyawan/siswa diizinkan untuk melakukan check-in presensi.

### Contoh:
- **Radius 1000m (1km)**: Karyawan bisa check-in dari jarak hingga 1km dari sekolah
- **Radius 500m**: Hanya bisa check-in dalam radius 500 meter dari sekolah
- **Radius 200m**: Sangat ketat, hanya di area dekat sekolah

---

## 🔧 Cara Mengatur Radius (Admin)

### Step 1: Login Sebagai Admin
```
Email: admin@company.com
Password: password123
```

### Step 2: Buka Admin Dashboard
- Halaman otomatis ke `/admin`
- Lihat 5 stat cards (Total, Hadir, Terlambat, Tidak Hadir, Rate)

### Step 3: Klik Tab "⚙️ Pengaturan"
- Di bagian Tabs, pilih tab "⚙️ Pengaturan"
- Form akan muncul dengan field-field pengaturan

### Step 4: Isi/Edit Form Pengaturan

```
┌─────────────────────────────────────────┐
│  PENGATURAN LOKASI GPS                  │
│                                         │
│  Nama Kantor/Sekolah: [SMKN 1 Mejayan] │
│  Radius Area (Meter): [1000]            │
│  → Preview: 1.0km                       │
│                                         │
│  Alamat Lengkap:                        │
│  [Area Sawah/Kebun, Pandean, Mejayan..]│
│                                         │
│  Latitude:  [-7.641]                    │
│  Longitude: [111.5088]                  │
│                                         │
│  [💾 Simpan Pengaturan]                 │
└─────────────────────────────────────────┘
```

### Step 5: Ubah Nilai Radius

**Opsi 1: Input Langsung**
```
Radius Area (Meter): [500]  ← Ubah dari 1000 menjadi 500
Klik [Simpan Pengaturan]
```

**Opsi 2: Menggunakan Preview**
- 100m = 0.1km (sangat ketat)
- 300m = 0.3km (ketat)
- 500m = 0.5km (normal)
- 1000m = 1.0km (flexible)
- 1500m = 1.5km (sangat flexible)
- 2000m = 2.0km (sangat flexible)

### Step 6: Konfirmasi Simpan
- Setelah klik "Simpan Pengaturan"
- Akan muncul notifikasi "Pengaturan berhasil disimpan!"
- Perubahan langsung berlaku untuk semua user

---

## 📍 Cara Menemukan Koordinat GPS Sekolah

### Metode 1: Google Maps (Termudah)

**Desktop:**
1. Buka Google Maps (maps.google.com)
2. Cari nama sekolah/kantor Anda
3. Klik kanan pada marker lokasi
4. Akan muncul popup dengan koordinat
5. Format: `latitude, longitude` (contoh: -7.641, 111.5088)
6. Copy angka latitude dan longitude

**Smartphone:**
1. Buka Google Maps
2. Cari sekolah Anda
3. Tekan tombol lokasi (pin icon)
4. Koordinat muncul di atas
5. Copy nilai latitude dan longitude

### Metode 2: Smartphone GPS (Paling Akurat)

**Android:**
1. Buka aplikasi Maps bawaan atau Google Maps
2. Pergi ke lokasi sekolah (fisik)
3. Tekan tombol "Lokasi Saya" (blue dot)
4. Lihat koordinat di layar
5. Tulis/copy koordinat

**iOS:**
1. Buka Maps app
2. Pergi ke lokasi sekolah
3. Tekan tombol lokasi (arrow icon)
4. Lihat koordinat di info panel
5. Screenshot atau catat koordinat

### Metode 3: Aplikasi GPS Khusus

Gunakan aplikasi seperti:
- GPS Essentials (Android)
- GPX Viewer (iOS)
- Untuk akurasi tinggi

---

## 🗺️ Format Koordinat GPS

### Latitude (Garis Lintang)
- **Range:** -90 hingga +90
- **Negatif** = Selatan khatulistiwa
- **Positif** = Utara khatulistiwa
- **Indonesia** = Negatif (di selatan)

**Contoh untuk Mejayan:**
```
Latitude: -7.641
(Tanda minus = Selatan khatulistiwa)
```

### Longitude (Garis Bujur)
- **Range:** -180 hingga +180
- **Negatif** = Barat meridian prime
- **Positif** = Timur meridian prime
- **Indonesia Barat** = Positif (di timur)

**Contoh untuk Mejayan:**
```
Longitude: 111.5088
(Positif = Timur meridian prime)
```

### Format Decimal
- Gunakan titik (.), bukan koma (,)
- Contoh yang BENAR: `-7.641, 111.5088`
- Contoh yang SALAH: `-7,641, 111,5088`

---

## 📏 Rekomendasi Radius Berdasarkan Situasi

### Untuk Sekolah Menengah
**Rekomendasi: 500m - 1000m**
- Cukup fleksibel untuk siswa
- Tetap kontrol kehadiran
- Default: 1000m ✅

### Untuk Kantor Pusat
**Rekomendasi: 200m - 500m**
- Ketat, hanya di gedung kantor
- Deteksi kedisiplinan tinggi

### Untuk Kantor Besar (Multi-Building)
**Rekomendasi: 1000m - 2000m**
- Mencakup seluruh kompleks kantor
- Fleksibel untuk building berbeda

### Untuk Lapangan/Outdoor
**Rekomendasi: 2000m - 5000m**
- Area kerja sangat luas
- Proyeknya di lapangan/pantai

---

## 🔄 Siklus Perubahan Radius

### Timeline Perubahan
```
Admin mengatur radius
        ↓
Klik "Simpan Pengaturan"
        ↓
Data disimpan ke localStorage
        ↓
Semua aplikasi yang dibuka get update otomatis
        ↓
Karyawan melihat radius baru (jika refresh)
```

### Kapan Update Berlaku
1. **Instan** untuk tab yang terbuka dan refresh
2. **Setelah refresh** untuk tab yang sudah dibuka
3. **Otomatis** saat user buka app baru

### Testing Perubahan Radius

**Scenario Test:**
1. User buka app Attendance (login sebagai Budi)
2. Admin buka app Admin → ubah radius jadi 100m
3. Admin klik "Simpan"
4. User di Attendance page perlu **refresh** (F5) untuk melihat perubahan
5. Jarak yang dijarak 1km sekarang akan ditolak (karena radius 100m)

---

## ✅ Checklist Pengaturan Radius

- [ ] Login sebagai admin@company.com
- [ ] Buka Admin Dashboard
- [ ] Klik tab "⚙️ Pengaturan"
- [ ] Lihat form pengaturan muncul
- [ ] Isi semua field:
  - [ ] Nama Kantor/Sekolah
  - [ ] Radius dalam meter
  - [ ] Alamat lengkap
  - [ ] Latitude dan Longitude
- [ ] Klik "Simpan Pengaturan"
- [ ] Muncul notifikasi "berhasil disimpan"
- [ ] Test dengan login sebagai employee
- [ ] Refresh halaman attendance
- [ ] Coba check-in dalam radius baru

---

## 🐛 Troubleshooting Radius Settings

### Masalah: Radius tidak berubah
**Solusi:**
1. Refresh halaman (F5)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check localStorage di DevTools
   - F12 → Application → Local Storage
   - Cari key "settings"
   - Lihat radiusMeters value

### Masalah: Koordinat GPS error
**Solusi:**
1. Gunakan format decimal (. bukan ,)
2. Latitude: Selalu -7.xxx untuk Jawa Timur
3. Longitude: Selalu 110-115 untuk Jawa Timur
4. Cek di Google Maps apakah koordinat benar

### Masalah: Perubahan tidak berlaku
**Solusi:**
1. Tutup dan buka app lagi
2. Clear localStorage → login ulang
3. Coba di browser berbeda
4. Check console (F12) untuk error

---

## 💡 Tips Profesional

### 1. Backup Koordinat
Simpan koordinat di dokumen terpisah:
```
SMKN 1 Mejayan
Latitude: -7.641
Longitude: 111.5088
Radius: 1000m
Alamat: Area Sawah/Kebun, Pandean, Mejayan
```

### 2. Zona Buffer
Tambahkan buffer saat set radius:
- Lokasi sekolah: Lat/Long
- Set radius: +200m dari batas gedung
- Jadi lebih fleksibel untuk GPS error

### 3. Testing Lokasi
Sebelum finalisasi:
1. Pergi ke lokasi sekolah dengan GPS
2. Check distance yang muncul di app
3. Adjust radius jika perlu

### 4. Dokumentasi Perubahan
Catat setiap perubahan radius:
```
Tanggal: 15 Jan 2025
Radius lama: 1000m
Radius baru: 500m
Alasan: Lebih ketat untuk disiplin
```

---

## 🎓 Skenario Penggunaan Real

### Scenario 1: Sekolah Normal
```
Waktu: Pukul 07:00 pagi
Siswa di sekitar sekolah ingin check-in
Radius: 1000m (cukup fleksibel)
Hasil: ✅ Bisa check-in di halaman, parkir, dll
```

### Scenario 2: WFH Hybrid
```
Waktu: Pukul 10:00 pagi
Karyawan baru di kantor saja
Admin ubah radius ke 200m (ketat)
Hasil: ✅ Hanya bisa di gedung kantor
```

### Scenario 3: Event Outdoor
```
Waktu: Acara di lapangan
Event memperluas area 5km
Admin ubah radius ke 5000m
Hasil: ✅ Semua peserta bisa check-in
```

---

## 📊 Perbandingan Radius

| Radius | Jarak | Kasus Penggunaan | Fleksibilitas |
|--------|-------|------------------|---------------|
| 100m | 100 meter | Gedung ketat | ⬜⬜⬜⬜⬜ |
| 300m | 300 meter | Blok kantor | ⬜⬜⬜⬜⬜ |
| 500m | 500 meter | Kampus kecil | ⬜⬜⬜⬜ |
| 1000m | 1 km | Sekolah normal | ⬜⬜⬜⬜⬜ |
| 1500m | 1.5 km | Kompleks besar | ⬜⬜⬜⬜⬜ |
| 2000m | 2 km | Universitas | ⬜⬜⬜⬜⬜ |
| 5000m | 5 km | Event outdoor | ⬜⬜⬜⬜⬜ |

---

## 🎉 Selesai!

Anda sudah menguasai sistem **Flexible GPS Radius Settings**.

### Ringkasan:
✅ Admin bisa mengatur radius kapan saja
✅ Update instan (setelah refresh)
✅ Koordinat GPS mudah ditemukan
✅ Support berbagai skenario penggunaan
✅ Data tersimpan aman di localStorage

**Selamat menggunakan!** 🚀
