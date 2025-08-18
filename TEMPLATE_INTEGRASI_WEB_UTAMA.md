# TEMPLATE INTEGRASI WEB UTAMA

## 📋 INFORMASI REPOSITORY VIRTUAL TOUR

### Repository Details
- **URL**: https://github.com/nasikhand/VirtualTour-Jubung.git
- **Branch**: main
- **Struktur**: Next.js standalone
- **Status**: Ready for integration
- **Last Update**: 13 Januari 2025

### Struktur Komponen Virtual Tour
```
components/virtual-tour/
├── AddMenuItemModal.tsx
├── AdjustRotationModal.tsx
├── CreateSceneModal.tsx
├── DeleteConfirmationModal.tsx
├── HotspotInfoModal.tsx
├── InfoEditor.tsx
├── InteractiveViewer.tsx
├── LinkHotspotEditor.tsx
├── LinkHotspotModal.tsx
├── PannellumViewer.tsx
├── PlacementEditor.tsx
├── ReactHotspot.tsx
├── RenameSpotModal.tsx
├── SceneCard.tsx
├── SceneCombobox.tsx
├── SceneEditor.tsx
├── SortableMenuItem.tsx
├── VirtualTourBase.tsx
└── VirtualTourClientPage.tsx
```

## 🔧 PERINTAH GIT SUBMODULE

### Menambahkan Submodule
```bash
# Di root directory web utama
git submodule add https://github.com/nasikhand/VirtualTour-Jubung.git virtual-tour
git submodule update --init --recursive
```

### Update Submodule
```bash
git submodule update --remote virtual-tour
```

## 🗂️ FILE YANG PERLU DIHAPUS DARI WEB UTAMA

### Frontend Components (Hapus Aman)
```
frontend/components/virtual-tour/
frontend/app/virtual-tour/
frontend/types/virtual-tour.d.ts
frontend/lib/data/virtual-tour.ts
```

### Backend Files (JANGAN HAPUS)
```
backend/app/Models/VirtualTour*.php
backend/app/Http/Controllers/VirtualTour*.php
backend/database/migrations/*virtual_tour*
backend/routes/api.php (bagian virtual tour)
```

## 🔗 UPDATE NAVIGASI

### Menu Utama
```typescript
// Ganti link virtual tour lama dengan:
{
  title: "Virtual Tour",
  href: "/virtual-tour", // Akan redirect ke submodule
  icon: "🏛️"
}
```

### Admin Sidebar
```typescript
// Update admin menu:
{
  title: "Virtual Tour Management",
  href: "/admin/virtual-tour", // Akan redirect ke submodule admin
  icon: "⚙️"
}
```

## 📄 ROUTING CONFIGURATION

### Public Route (pages/virtual-tour/index.tsx)
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VirtualTourRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect ke submodule virtual tour
    window.location.href = '/virtual-tour/';
  }, []);
  
  return <div>Redirecting to Virtual Tour...</div>;
}
```

### Admin Route (pages/admin/virtual-tour/index.tsx)
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminVirtualTourRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect ke submodule admin
    window.location.href = '/virtual-tour/admin';
  }, []);
  
  return <div>Redirecting to Virtual Tour Admin...</div>;
}
```

## 🔒 BACKUP COMMANDS

### Sebelum Integrasi
```bash
# Buat backup branch
git checkout -b backup-before-vtour-integration
git add .
git commit -m "Backup before Virtual Tour integration"
git push origin backup-before-vtour-integration

# Kembali ke main/development branch
git checkout main
```

## ✅ TESTING CHECKLIST

### Setelah Integrasi
- [ ] Virtual Tour public page dapat diakses
- [ ] Virtual Tour admin panel berfungsi
- [ ] API backend masih berfungsi
- [ ] Navigation menu terupdate
- [ ] No broken links
- [ ] Submodule dapat di-update

## 🚀 DEPLOYMENT

### Production Deployment
```bash
# Setelah testing berhasil
git add .
git commit -m "Integrate Virtual Tour as submodule"
git push origin main

# Deploy dengan submodule
git submodule update --init --recursive
```

## 📞 TROUBLESHOOTING

### Jika Submodule Tidak Terupdate
```bash
git submodule update --remote --merge
```

### Jika Ada Konflik
```bash
git submodule deinit virtual-tour
git rm virtual-tour
git submodule add https://github.com/nasikhand/VirtualTour-Jubung.git virtual-tour
```

---
**Template ini siap di-copy ke proyek web utama untuk panduan integrasi**