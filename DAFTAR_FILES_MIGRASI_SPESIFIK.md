# DAFTAR FILES SPESIFIK UNTUK MIGRASI VIRTUAL TOUR

**Source Project**: `d:\Nasikh\new\sistem-informasi-manajemen_PMM-JEMBER`  
**Target Repository**: `https://github.com/nasikhand/VirtualTour-Jubung`  
**Tanggal**: 12 Agustus 2025

## 📁 FILES YANG HARUS DIPINDAHKAN

### **🔥 HIGH PRIORITY - WAJIB DIPINDAHKAN**

#### **1. Virtual Tour Components**
```
frontend/components/virtual-tour/
├── VirtualTourViewer.tsx
├── HotspotEditor.tsx
├── LinkHotspotEditor.tsx
├── PlacementEditor.tsx
├── AdjustRotationModal.tsx
├── NavigationMenu.tsx
└── [semua file lain dalam folder ini]
```

#### **2. Admin Pages Virtual Tour**
```
frontend/app/admin/virtual-tour-section/
├── page.tsx
├── scenes/
└── [semua subfolder dan file]

frontend/app/admin/virtual-tour-hotspots/
└── page.tsx
```

#### **3. Type Definitions**
```
frontend/types/virtual-tour.d.ts
frontend/pannellum-react.d.ts
```

### **⚡ MEDIUM PRIORITY - DIPERLUKAN**

#### **4. UI Components (Yang Digunakan Virtual Tour)**
```
frontend/components/ui/
├── button.tsx
├── dialog.tsx
├── input.tsx
├── select.tsx
├── textarea.tsx
├── label.tsx
├── card.tsx
├── badge.tsx
├── alert.tsx
├── toast.tsx
└── [components lain yang digunakan virtual tour]
```

#### **5. Admin Components (Yang Digunakan Virtual Tour)**
```
frontend/components/admin/
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── AdminLayout.tsx
└── [components admin lain yang diperlukan]
```

#### **6. Library & Utilities**
```
frontend/lib/
├── utils.ts
├── api-client.ts
└── [utility functions yang diperlukan]
```

#### **7. Configuration Files**
```
frontend/next.config.js
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/components.json
frontend/postcss.config.mjs
frontend/eslint.config.mjs
```

### **📦 LOW PRIORITY - OPSIONAL**

#### **8. Styles**
```
frontend/app/globals.css
```

#### **9. Assets Virtual Tour**
```
frontend/public/assets/virtual-tour/
├── [semua gambar panorama]
├── [semua icon hotspot]
└── [semua asset virtual tour lainnya]

frontend/public/icons/
├── [icon yang digunakan virtual tour]
└── [icon navigation]
```

#### **10. Root Layout & Pages**
```
frontend/app/layout.tsx
frontend/app/page.tsx (jika diperlukan sebagai homepage)
frontend/app/favicon.ico
```

## 🚫 FILES YANG TIDAK PERLU DIPINDAHKAN

### **Components Lain**
```
frontend/components/culinary/
frontend/components/destinations/
frontend/components/events/
frontend/components/main/
frontend/components/navbar/
frontend/components/sections/
frontend/components/review-card.tsx
```

### **Pages Lain**
```
frontend/app/(auth)/
frontend/app/(public)/
frontend/app/admin/ (kecuali virtual-tour pages)
frontend/app/api/ (kecuali virtual-tour API)
```

### **Context & Features Lain**
```
frontend/context/AuthContext.tsx
frontend/features/auth/
frontend/lib/broadcast.ts
frontend/lib/data/
```

### **Assets Lain**
```
frontend/assets/images/ (kecuali virtual-tour)
frontend/assets/svg/ (kecuali virtual-tour)
frontend/public/beranda/
frontend/public/file.svg
frontend/public/globe.svg
frontend/public/next.svg
frontend/public/vercel.svg
frontend/public/window.svg
```

### **Backend (Tidak Dipindahkan)**
```
backend/ (seluruh folder)
```

## 📋 CHECKLIST PEMINDAHAN

### **Phase 1: Core Components**
- [ ] Copy `frontend/components/virtual-tour/` → `components/virtual-tour/`
- [ ] Copy `frontend/app/admin/virtual-tour-section/` → `app/admin/virtual-tour-section/`
- [ ] Copy `frontend/app/admin/virtual-tour-hotspots/` → `app/admin/virtual-tour-hotspots/`
- [ ] Copy type definitions → `types/`

### **Phase 2: Dependencies**
- [ ] Copy UI components yang diperlukan → `components/ui/`
- [ ] Copy admin components → `components/admin/`
- [ ] Copy lib utilities → `lib/`

### **Phase 3: Configuration**
- [ ] Copy configuration files ke root
- [ ] Copy styles → `app/globals.css`
- [ ] Setup package.json dengan dependencies minimal

### **Phase 4: Assets**
- [ ] Copy virtual tour assets → `public/assets/virtual-tour/`
- [ ] Copy icons yang diperlukan → `public/icons/`
- [ ] Copy logo → `public/logo.png`

### **Phase 5: Root Files**
- [ ] Copy layout.tsx → `app/layout.tsx`
- [ ] Create homepage → `app/page.tsx`
- [ ] Copy favicon → `app/favicon.ico`

## 🔧 MODIFIKASI YANG DIPERLUKAN SETELAH COPY

### **1. Update Import Paths**
```typescript
// Dari:
import { Button } from '@/components/ui/button'
// Ke:
import { Button } from '@/components/ui/button'
// (tetap sama jika struktur dipertahankan)
```

### **2. Update API Endpoints**
```typescript
// Update base URL di api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

### **3. Update Package.json**
```json
{
  "name": "virtual-tour-jubung",
  "version": "1.0.0",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "pannellum-react": "^0.2.6",
    "axios": "^1.6.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

### **4. Update Environment Variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage
NEXT_PUBLIC_APP_NAME="Virtual Tour Jubung"
```

## 📊 ESTIMASI SIZE SETELAH MIGRASI

### **Before (Current)**
- Total files: ~500+ files
- Size: ~50MB+ (dengan node_modules)
- Components: ~30+ components

### **After (Migrated)**
- Total files: ~100-150 files
- Size: ~15-20MB (dengan node_modules)
- Components: ~10-15 components (virtual tour specific)

## 🎯 PRIORITAS EKSEKUSI

### **Hari Ini (12 Agustus)**
1. **HIGH PRIORITY**: Virtual tour components + admin pages
2. **MEDIUM PRIORITY**: UI components + configuration
3. **LOW PRIORITY**: Assets + styles

### **Besok (13 Agustus)**
1. Testing & debugging
2. API integration testing
3. Performance optimization
4. Documentation update

---

**Note**: Daftar ini dibuat berdasarkan struktur folder yang ada. Pastikan untuk backup repository sebelum melakukan pemindahan files.