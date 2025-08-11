# Virtual Tour Kebun Jubung

Sistem Virtual Tour untuk Kebun Jubung - PMM Jember. Aplikasi Next.js standalone yang dioptimalkan khusus untuk virtual tour menggunakan teknologi Pannellum.

## 🚀 Fitur Utama

- **Virtual Tour Interaktif** dengan teknologi 360° panorama
- **Hotspot Management** untuk informasi dan navigasi
- **Admin Panel** untuk mengelola scene dan hotspot
- **Responsive Design** yang mobile-friendly
- **Performance Optimized** untuk loading yang cepat

## 🛠️ Teknologi

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Pannellum** - 360° panorama viewer
- **Lucide React** - Icons

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd VirtualTour-Jubung
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Struktur Proyek

```
├── app/
│   ├── admin/              # Admin panel
│   ├── virtual-tour/       # Public virtual tour
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── virtual-tour/      # Virtual tour components
│   └── admin/             # Admin components
├── lib/
│   └── data/              # Data utilities
├── types/
│   └── virtual-tour.d.ts  # TypeScript definitions
└── public/
    └── assets/            # Static assets
```

## 🎯 Penggunaan

### Admin Panel
Akses `/admin` untuk:
- Mengelola scene virtual tour
- Menambah/edit hotspot
- Mengatur navigasi antar scene

### Public Virtual Tour
Akses `/virtual-tour` untuk:
- Melihat virtual tour publik
- Navigasi interaktif
- Informasi hotspot

## 🔧 Development

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Linting
npm run lint
```

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VIRTUAL_TOUR_ASSETS_URL=/assets/virtual-tour
NEXT_PUBLIC_PANNELLUM_CDN=https://cdn.jsdelivr.net/npm/pannellum@2.5.6
```

## 🚀 Deployment

Proyek ini dapat di-deploy ke:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **VPS** dengan Node.js

## 📄 License

MIT License - PMM Jember

## 🤝 Contributing

Kontribusi selalu diterima! Silakan buat issue atau pull request.

---

**Dibuat dengan ❤️ oleh PMM Jember**
