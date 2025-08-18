# PANDUAN PROMPT UNTUK WEB UTAMA

## 📋 OVERVIEW
Panduan ini berisi prompt yang tepat untuk digunakan di proyek web utama agar AI dapat menganalisis dan mengintegrasikan Virtual Tour dengan benar.

## 🎯 TUJUAN INTEGRASI
- Menghapus file virtual tour lama dari web utama
- Mengintegrasikan Virtual Tour sebagai Git submodule
- Mengupdate navigasi dan routing
- Memastikan kompatibilitas dengan struktur baru

## 📝 PROMPT YANG HARUS DIGUNAKAN

### 1. PROMPT ANALISIS AWAL
```
Saya memiliki proyek web utama yang sebelumnya menggunakan virtual tour terintegrasi. Sekarang saya ingin mengintegrasikan Virtual Tour yang sudah dimigrasi ke struktur Next.js standalone dari repository terpisah.

Repository Virtual Tour: https://github.com/nasikhand/VirtualTour-Jubung.git
Branch: main (sudah berisi struktur Next.js terbaru)

Tolong analisis:
1. File-file virtual tour lama yang perlu dihapus dari web utama
2. Cara mengintegrasikan sebagai Git submodule
3. Update navigasi dan routing yang diperlukan
4. Langkah-langkah backup dan testing

Berikan panduan step-by-step yang aman dan terstruktur.
```

### 2. PROMPT BACKUP DAN PERSIAPAN
```
Sebelum melakukan integrasi Virtual Tour, saya perlu:
1. Membuat backup lengkap dari proyek web utama
2. Mengidentifikasi semua file virtual tour yang akan dihapus
3. Memastikan API backend tetap berfungsi

Tolong buatkan:
- Perintah Git untuk backup
- Daftar file/folder yang aman untuk dihapus
- Checklist persiapan integrasi
```

### 3. PROMPT IMPLEMENTASI INTEGRASI
```
Saya siap mengimplementasikan integrasi Virtual Tour. Repository Virtual Tour sudah siap di:
https://github.com/nasikhand/VirtualTour-Jubung.git (branch: main)

Tolong implementasikan:
1. Git submodule setup
2. Update navigasi menu untuk mengarah ke virtual tour
3. Konfigurasi routing yang diperlukan
4. Testing integrasi

Gunakan pendekatan yang aman dengan backup di setiap langkah.
```

## ⚠️ PENTING - JANGAN LAKUKAN
- ❌ Jangan copy-paste file manual
- ❌ Jangan edit struktur Virtual Tour
- ❌ Jangan hapus API backend
- ❌ Jangan skip backup

## ✅ YANG HARUS DILAKUKAN
- ✅ Gunakan Git submodule
- ✅ Backup sebelum perubahan
- ✅ Test setiap langkah
- ✅ Ikuti panduan step-by-step

## 📁 INFORMASI REPOSITORY
- **Virtual Tour Repository**: https://github.com/nasikhand/VirtualTour-Jubung.git
- **Branch Utama**: main
- **Struktur**: Next.js standalone
- **Status**: Siap untuk integrasi

## 🔄 ALUR INTEGRASI
1. **Analisis** → Identifikasi file lama
2. **Backup** → Simpan state saat ini
3. **Cleanup** → Hapus file virtual tour lama
4. **Submodule** → Tambahkan sebagai submodule
5. **Navigation** → Update menu dan routing
6. **Testing** → Verifikasi semua berfungsi
7. **Deploy** → Push ke production

## 📞 SUPPORT
Jika ada masalah atau pertanyaan, gunakan panduan integrasi lengkap di:
`PANDUAN_INTEGRASI_WEB_UTAMA.md`

---
**Dibuat**: 13 Januari 2025  
**Status**: Siap digunakan  
**Repository**: VirtualTour-Jubung (main branch)