# PANDUAN INTEGRASI VIRTUAL TOUR KE WEB UTAMA

**Tanggal**: Agustus 2025  
**Status**: Ready for Integration

## 🔄 OVERVIEW INTEGRASI

Dokumen ini menjelaskan cara mengintegrasikan repository Virtual Tour Kebun Jubung ke dalam web utama wisata. Integrasi dilakukan dengan memanfaatkan fitur Git submodule atau dengan mengimpor komponen-komponen yang diperlukan.

## 📋 METODE INTEGRASI

### Metode 1: Git Submodule (Direkomendasikan)

Git submodule memungkinkan Anda untuk menyimpan repository Virtual Tour sebagai subdirektori dalam repository web utama, sambil tetap menjaga keduanya terpisah.

#### Langkah-langkah:

1. **Tambahkan submodule ke repository web utama**

```bash
# Di repository web utama
cd /path/to/web-utama
git submodule add https://github.com/nasikhand/VirtualTour-Jubung.git virtual-tour
git commit -m "Add Virtual Tour as submodule"
git push origin main
```

2. **Update submodule saat ada perubahan**

```bash
# Update semua submodule
git submodule update --remote --merge
git commit -m "Update Virtual Tour submodule"
git push origin main
```

3. **Clone repository web utama dengan submodule**

```bash
# Clone dengan submodule
git clone --recurse-submodules https://github.com/username/web-utama.git
```

### Metode 2: Copy dan Import Komponen

Jika Anda tidak ingin menggunakan submodule, Anda dapat menyalin komponen-komponen yang diperlukan ke dalam web utama.

#### Langkah-langkah:

1. **Salin folder komponen virtual tour**

```bash
cp -r VirtualTour-Jubung/components/virtual-tour web-utama/components/
cp -r VirtualTour-Jubung/app/virtual-tour web-utama/app/
```

2. **Salin dependencies yang diperlukan**

Pastikan untuk menambahkan dependencies yang diperlukan ke `package.json` web utama.

## 🔐 INTEGRASI AUTENTIKASI

### Opsi 1: Menggunakan Sistem Auth Web Utama

Untuk mengintegrasikan sistem autentikasi Virtual Tour dengan web utama:

1. **Modifikasi AdminLayout untuk menggunakan auth web utama**

```typescript
// app/admin/layout.tsx
import { useAuth } from '@/path/to/web-utama/auth';

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Redirect jika tidak terautentikasi atau bukan admin
  if (!isAuthenticated || !isAdmin) {
    return <Redirect to="/login" />;
  }
  
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <main>{children}</main>
    </div>
  );
};
```

2. **Gunakan API endpoint web utama untuk autentikasi**

```typescript
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEB_UTAMA_API_URL,
  withCredentials: true, // Untuk mengirim cookies
});

export default apiClient;
```

### Opsi 2: Menggunakan Auth Terpisah (Sementara)

Jika integrasi penuh belum memungkinkan, gunakan sistem auth terpisah seperti yang sudah diimplementasikan di halaman `/admin/sign-in`.

## 🌐 ROUTING DAN NAVIGASI

### Integrasi ke Menu Web Utama

Tambahkan link ke Virtual Tour di menu navigasi web utama:

```jsx
// Contoh menu navigasi web utama
<nav>
  <ul>
    <li><a href="/">Beranda</a></li>
    <li><a href="/destinasi">Destinasi</a></li>
    <li><a href="/kuliner">Kuliner</a></li>
    <li><a href="/virtual-tour">Virtual Tour</a></li> {/* Link ke Virtual Tour */}
    <li><a href="/kontak">Kontak</a></li>
  </ul>
</nav>
```

### Akses Admin Panel

Akses admin panel Virtual Tour melalui panel admin web utama:

```jsx
// Contoh sidebar admin web utama
<Sidebar>
  <SidebarItem href="/admin/dashboard">Dashboard</SidebarItem>
  <SidebarItem href="/admin/destinasi">Destinasi</SidebarItem>
  <SidebarItem href="/admin/virtual-tour">Virtual Tour</SidebarItem> {/* Link ke admin Virtual Tour */}
  <SidebarItem href="/admin/pengguna">Pengguna</SidebarItem>
</Sidebar>
```

## 🎨 STYLING DAN UI

### Menyesuaikan Tema

Untuk menyesuaikan tampilan Virtual Tour dengan web utama:

1. **Sesuaikan variabel Tailwind CSS**

```js
// tailwind.config.js web utama
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', // Gunakan variabel yang sama dengan web utama
        // ... warna lainnya
      },
      // ... konfigurasi lainnya
    },
  },
  // ... konfigurasi lainnya
};
```

2. **Import style global web utama**

```css
/* app/globals.css Virtual Tour */
@import url('/path/to/web-utama/styles/globals.css');

/* Style tambahan khusus Virtual Tour */
```

## 🔄 SHARING DATA

### API Integration

Untuk berbagi data antara Virtual Tour dan web utama:

1. **Gunakan API endpoint web utama**

```typescript
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEB_UTAMA_API_URL,
});

export const getVirtualTourData = async () => {
  const response = await apiClient.get('/virtual-tours');
  return response.data;
};

export const updateVirtualTourData = async (data) => {
  const response = await apiClient.post('/virtual-tours', data);
  return response.data;
};
```

2. **Buat API endpoint di web utama untuk Virtual Tour**

```typescript
// app/api/virtual-tours/route.ts di web utama
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const tours = await db.virtualTour.findMany();
  return NextResponse.json(tours);
}

export async function POST(request) {
  const data = await request.json();
  const tour = await db.virtualTour.create({ data });
  return NextResponse.json(tour);
}
```

## 🚀 DEPLOYMENT

### Opsi 1: Deploy Bersama Web Utama

Jika menggunakan Git submodule, Virtual Tour akan di-deploy bersama web utama:

```bash
# Build web utama (termasuk Virtual Tour)
cd /path/to/web-utama
npm run build
```

### Opsi 2: Deploy Terpisah dengan Subdomain

Jika ingin men-deploy Virtual Tour terpisah:

1. **Deploy Virtual Tour ke subdomain**

```
virtual-tour.website-utama.com
```

2. **Gunakan CORS untuk komunikasi antar domain**

```typescript
// next.config.js di Virtual Tour
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://website-utama.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

## 📝 CONTOH KODE INTEGRASI

### Contoh Integrasi Komponen Virtual Tour ke Web Utama

```jsx
// pages/virtual-tour.js di web utama
import VirtualTourViewer from '@/virtual-tour/components/virtual-tour/VirtualTourViewer';
import { getVirtualTourData } from '@/lib/api';

export default function VirtualTourPage({ tourData }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Tour Kebun Jubung</h1>
      <VirtualTourViewer data={tourData} />
    </div>
  );
}

export async function getServerSideProps() {
  const tourData = await getVirtualTourData();
  return { props: { tourData } };
}
```

### Contoh Integrasi Admin Panel

```jsx
// pages/admin/virtual-tour.js di web utama
import { useAuth } from '@/lib/auth';
import AdminVirtualTour from '@/virtual-tour/components/admin/VirtualTourAdmin';

export default function AdminVirtualTourPage() {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <div>Akses ditolak</div>;
  }
  
  return (
    <div className="admin-container">
      <h1 className="text-2xl font-bold mb-4">Manajemen Virtual Tour</h1>
      <AdminVirtualTour user={user} />
    </div>
  );
}
```

## 🔍 TROUBLESHOOTING

### Masalah Umum dan Solusi

1. **Konflik Dependensi**
   - Pastikan versi dependencies di Virtual Tour dan web utama kompatibel
   - Gunakan pnpm workspaces atau yarn workspaces untuk mengelola dependencies

2. **Masalah CORS**
   - Konfigurasi header CORS di API routes
   - Gunakan proxy di development environment

3. **Konflik Styling**
   - Gunakan CSS modules atau styled-components untuk isolasi style
   - Prefix class Tailwind untuk menghindari konflik

## 📞 DUKUNGAN DAN KONTAK

Jika mengalami masalah dalam integrasi, hubungi:

- **Developer**: Tim Pengembang PMM Jember
- **Email**: pmm.jember@example.com
- **GitHub**: https://github.com/nasikhand/VirtualTour-Jubung

---

**Dibuat dengan ❤️ oleh PMM Jember**