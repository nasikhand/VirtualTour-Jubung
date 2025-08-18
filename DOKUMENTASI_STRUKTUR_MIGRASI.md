# DOKUMENTASI STRUKTUR MIGRASI VIRTUAL TOUR

**Repository Target**: `https://github.com/nasikhand/VirtualTour-Jubung`  
**Tanggal**: 12 Agustus 2025  
**Status**: Ready for Implementation

## 🏗️ ARSITEKTUR REPOSITORY BARU

### **STRUKTUR FOLDER YANG DIREKOMENDASIKAN**

```
VirtualTour-Jubung/
├── .env.example                 # Template environment variables
├── .gitignore                   # Git ignore rules
├── README.md                    # Dokumentasi project
├── package.json                 # Dependencies & scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
│
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── favicon.ico              # Favicon
│   │
│   ├── admin/                   # Admin routes
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── virtual-tour-management/
│   │   ├── virtual-tour-hotspots/
│   │   └── virtual-tour-viewer/
│   │
│   └── api/                     # API routes (jika diperlukan)
│       └── virtual-tour/
│
├── components/                  # React components
│   ├── virtual-tour/            # Virtual tour components
│   │   ├── VirtualTourViewer.tsx
│   │   ├── HotspotEditor.tsx
│   │   ├── LinkHotspotEditor.tsx
│   │   ├── PlacementEditor.tsx
│   │   ├── AdjustRotationModal.tsx
│   │   └── NavigationMenu.tsx
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   └── admin/                   # Admin-specific components
│       ├── AdminSidebar.tsx
│       └── AdminHeader.tsx
│
├── lib/                         # Utility libraries
│   ├── utils.ts                 # General utilities
│   ├── api-client.ts            # API client configuration
│   └── constants.ts             # Application constants
│
├── types/                       # TypeScript type definitions
│   ├── virtual-tour.d.ts        # Virtual tour types
│   └── index.d.ts               # General types
│
├── public/                      # Static assets
│   ├── assets/
│   │   └── virtual-tour/        # Virtual tour images
│   ├── icons/                   # Icon files
│   └── logo.png                 # Application logo
│
└── docs/                        # Documentation
    ├── API.md                   # API documentation
    ├── DEPLOYMENT.md            # Deployment guide
    └── DEVELOPMENT.md           # Development guide
```

## 🔧 TEKNOLOGI STACK

### **Frontend Framework**
- **Next.js 15**: React framework dengan App Router
- **React 18**: UI library dengan hooks dan concurrent features
- **TypeScript**: Type-safe JavaScript development

### **Styling & UI**
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library

### **Virtual Tour Engine**
- **Pannellum**: 360° panorama viewer
- **pannellum-react**: React wrapper untuk Pannellum

### **State Management & Data**
- **Axios**: HTTP client untuk API calls
- **React Hooks**: Built-in state management

### **Development Tools**
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Git**: Version control

## 🧠 LOGIKA APLIKASI

### **1. VIRTUAL TOUR VIEWER**
```typescript
// Komponen utama untuk menampilkan virtual tour
VirtualTourViewer {
  - Load panorama images
  - Render hotspots (info & link)
  - Handle navigation between scenes
  - Manage tour state
}
```

### **2. HOTSPOT MANAGEMENT**
```typescript
// Sistem manajemen hotspot
HotspotEditor {
  - Create/Edit/Delete hotspots
  - Position hotspots on panorama
  - Configure hotspot properties
  - Preview hotspot appearance
}

LinkHotspotEditor {
  - Create navigation links
  - Connect scenes together
  - Set transition effects
}
```

### **3. ADMIN INTERFACE**
```typescript
// Interface administrasi
AdminPanel {
  - Virtual tour management
  - Scene upload & organization
  - Hotspot configuration
  - Tour preview & testing
}
```

### **4. API INTEGRATION**
```typescript
// Koneksi dengan Laravel backend
APIClient {
  - Authentication
  - CRUD operations
  - File upload handling
  - Error management
}
```

## 🔄 FLOW DATA

### **1. TOUR LOADING FLOW**
```
User Request → API Call → Laravel Backend → Database → 
JSON Response → Frontend State → Pannellum Render
```

### **2. HOTSPOT CREATION FLOW**
```
Admin Click → Position Capture → Form Input → 
Validation → API Submit → Database Save → UI Update
```

### **3. NAVIGATION FLOW**
```
Hotspot Click → Scene Transition → New Panorama Load → 
Hotspot Render → Navigation Update
```

## 📡 API ENDPOINTS

### **Virtual Tour Management**
```
GET    /api/virtual-tours           # List all tours
POST   /api/virtual-tours           # Create new tour
GET    /api/virtual-tours/{id}      # Get specific tour
PUT    /api/virtual-tours/{id}      # Update tour
DELETE /api/virtual-tours/{id}      # Delete tour
```

### **Scene Management**
```
GET    /api/scenes                  # List scenes
POST   /api/scenes                  # Upload new scene
PUT    /api/scenes/{id}             # Update scene
DELETE /api/scenes/{id}             # Delete scene
```

### **Hotspot Management**
```
GET    /api/hotspots                # List hotspots
POST   /api/hotspots                # Create hotspot
PUT    /api/hotspots/{id}           # Update hotspot
DELETE /api/hotspots/{id}           # Delete hotspot
```

## 🔐 ENVIRONMENT CONFIGURATION

### **Environment Variables**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage

# Application Settings
NEXT_PUBLIC_APP_NAME="Virtual Tour Jubung"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Settings
NODE_ENV=development
```

## 📦 DEPENDENCIES

### **Core Dependencies**
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### **Virtual Tour Specific**
```json
{
  "pannellum-react": "^0.2.6",
  "axios": "^1.6.0"
}
```

### **UI & Styling**
```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "lucide-react": "^0.263.1"
}
```

## 🚀 DEPLOYMENT STRATEGY

### **Development**
```bash
npm run dev     # Local development server
npm run build   # Production build
npm run start   # Production server
```

### **Production Options**
- **Vercel**: Recommended untuk Next.js apps
- **Netlify**: Alternative deployment platform
- **Docker**: Containerized deployment
- **VPS**: Custom server deployment

## 📋 MIGRATION CHECKLIST

### **Phase 1: Setup Repository**
- [ ] Clone repository structure
- [ ] Setup package.json dengan dependencies minimal
- [ ] Configure environment variables
- [ ] Setup Git dan initial commit

### **Phase 2: Component Migration**
- [ ] Copy virtual-tour components
- [ ] Copy UI components yang diperlukan
- [ ] Copy type definitions
- [ ] Update import paths

### **Phase 3: Configuration**
- [ ] Setup Next.js configuration
- [ ] Configure Tailwind CSS
- [ ] Setup TypeScript configuration
- [ ] Configure ESLint

### **Phase 4: Testing**
- [ ] Test development server
- [ ] Test component rendering
- [ ] Test API integration
- [ ] Test build process

### **Phase 5: Documentation**
- [ ] Update README.md
- [ ] Create API documentation
- [ ] Create deployment guide
- [ ] Create development guide

## 🔗 KONEKSI DENGAN MAIN PROJECT

### **API Connection**
- Virtual tour app akan tetap menggunakan Laravel backend dari main project
- Authentication akan di-handle melalui API calls
- File uploads akan diarahkan ke storage main project

### **Data Sharing**
- Database tetap menggunakan schema dari main project
- Virtual tour tables akan tetap accessible
- No data migration required

### **Asset Management**
- Images akan tetap disimpan di main project storage
- CDN links akan point ke main project
- Backup strategy tetap mengikuti main project

---

**Dokumentasi ini akan menjadi referensi utama untuk implementasi dan maintenance repository virtual tour yang terpisah.**