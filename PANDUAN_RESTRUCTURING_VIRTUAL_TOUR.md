\# PANDUAN RESTRUCTURING VIRTUAL TOUR REPOSITORY

## ANALISIS STRUKTUR SAAT INI

Berdasarkan informasi bahwa Anda sudah membuat repository dengan struktur yang sama persis seperti project utama (ada folder `frontend` dan `backend`), ini **TIDAK OPTIMAL** untuk virtual tour yang standalone.

### ❌ MASALAH STRUKTUR SAAT INI:

1. **Terlalu Kompleks**: Repository virtual tour tidak memerlukan folder `backend` terpisah
2. **Duplikasi Dependencies**: Banyak dependencies yang tidak relevan
3. **Maintenance Sulit**: Struktur yang sama dengan main project membuat konflik
4. **Performance**: File size repository menjadi besar dan lambat

## ✅ STRUKTUR OPTIMAL YANG DIREKOMENDASIKAN

```
VirtualTour-Jubung/
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── virtual-tour/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── components/
│   └── api/
│       └── virtual-tour/
├── components/
│   ├── ui/
│   └── virtual-tour/
│       ├── VirtualTourViewer.tsx
│       ├── HotspotEditor.tsx
│       ├── PlacementEditor.tsx
│       └── NavigationMenu.tsx
├── lib/
│   ├── utils.ts
│   └── api-client.ts
├── types/
│   └── virtual-tour.d.ts
├── public/
│   ├── assets/
│   │   └── virtual-tour/
│   └── icons/
└── pannellum-react.d.ts
```

## 🔄 LANGKAH RESTRUCTURING

### FASE 1: BACKUP & PREPARATION

1. **Backup Repository Saat Ini**
   ```bash
   cd VirtualTour-Jubung
   git branch backup-original
   git checkout backup-original
   git push origin backup-original
   ```

2. **Kembali ke Main Branch**
   ```bash
   git checkout main
   ```

### FASE 2: CLEANUP STRUKTUR

3. **Hapus Folder Backend**
   ```bash
   rm -rf backend/
   git add .
   git commit -m "Remove backend folder - virtual tour is frontend only"
   ```

4. **Restructure Frontend ke Root**
   ```bash
   # Pindahkan semua isi frontend ke root
   mv frontend/* .
   mv frontend/.* . 2>/dev/null || true
   rmdir frontend
   ```

### FASE 3: CLEANUP DEPENDENCIES

5. **Buat package.json Minimal**
   ```json
   {
     "name": "virtual-tour-jubung",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     },
     "dependencies": {
       "next": "15.1.6",
       "react": "^18",
       "react-dom": "^18",
       "pannellum-react": "^1.2.4",
       "axios": "^1.6.0",
       "@radix-ui/react-dialog": "^1.0.5",
       "@radix-ui/react-select": "^2.0.0",
       "lucide-react": "^0.263.1",
       "tailwindcss": "^3.3.0",
       "typescript": "^5"
     },
     "devDependencies": {
       "@types/node": "^20",
       "@types/react": "^18",
       "@types/react-dom": "^18",
       "eslint": "^8",
       "eslint-config-next": "15.1.6",
       "postcss": "^8",
       "autoprefixer": "^10.0.1"
     }
   }
   ```

### FASE 4: FILTER FILES VIRTUAL TOUR

6. **Hapus Files yang Tidak Relevan**
   ```bash
   # Hapus components yang tidak terkait virtual tour
   rm -rf components/admin/destinations/
   rm -rf components/admin/events/
   rm -rf components/admin/culinary/
   rm -rf components/navbar/
   rm -rf components/sections/
   rm components/review-card.tsx
   
   # Hapus pages yang tidak terkait
   rm -rf app/(auth)/
   rm -rf app/(public)/
   rm -rf app/admin/destinations*/
   rm -rf app/admin/events*/
   rm -rf app/admin/culinary*/
   rm -rf app/admin/reviews*/
   ```

7. **Pertahankan Hanya Files Virtual Tour**
   - `components/virtual-tour/`
   - `app/admin/virtual-tour*/`
   - `types/virtual-tour.d.ts`
   - `pannellum-react.d.ts`

### FASE 5: SETUP ENVIRONMENT

8. **Buat .env.example**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Virtual Tour Specific
   NEXT_PUBLIC_VIRTUAL_TOUR_ASSETS_URL=/assets/virtual-tour
   NEXT_PUBLIC_PANNELLUM_CDN=https://cdn.jsdelivr.net/npm/pannellum@2.5.6
   ```

9. **Update .gitignore**
   ```gitignore
   # Dependencies
   node_modules/
   
   # Next.js
   .next/
   out/
   
   # Environment
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   
   # Logs
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   
   # Runtime data
   pids
   *.pid
   *.seed
   *.pid.lock
   
   # Virtual Tour Assets (large files)
   public/assets/virtual-tour/images/
   *.jpg
   *.jpeg
   *.png
   *.webp
   ```

### FASE 6: SETUP BASIC PAGES

10. **Buat app/layout.tsx**
    ```tsx
    import './globals.css'
    import { Inter } from 'next/font/google'
    
    const inter = Inter({ subsets: ['latin'] })
    
    export const metadata = {
      title: 'Virtual Tour Kebun Jubung',
      description: 'Virtual Tour System for PMM Jember',
    }
    
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="id">
          <body className={inter.className}>{children}</body>
        </html>
      )
    }
    ```

11. **Buat app/page.tsx**
    ```tsx
    import Link from 'next/link'
    
    export default function HomePage() {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Virtual Tour Kebun Jubung
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Jelajahi keindahan Kebun Jubung secara virtual
              </p>
              <div className="space-x-4">
                <Link 
                  href="/virtual-tour" 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mulai Virtual Tour
                </Link>
                <Link 
                  href="/admin" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }
    ```

### FASE 7: TESTING & COMMIT

12. **Install Dependencies**
    ```bash
    npm install
    ```

13. **Test Development Server**
    ```bash
    npm run dev
    ```

14. **Commit Changes**
    ```bash
    git add .
    git commit -m "Restructure: Convert to standalone Next.js virtual tour app"
    git push origin main
    ```

## 🎯 KEUNTUNGAN STRUKTUR BARU

### ✅ **Performance**
- Repository size berkurang drastis
- Dependencies minimal dan relevan
- Build time lebih cepat

### ✅ **Maintainability**
- Fokus hanya pada virtual tour
- Tidak ada konflik dengan main project
- Easier debugging dan development

### ✅ **Deployment**
- Bisa di-deploy independent
- Scaling terpisah dari main app
- CI/CD pipeline lebih simple

### ✅ **Development**
- Hot reload lebih cepat
- Easier testing
- Clear separation of concerns

## 📋 CHECKLIST RESTRUCTURING

- [ ] Backup repository saat ini
- [ ] Hapus folder backend
- [ ] Pindahkan frontend ke root
- [ ] Cleanup dependencies di package.json
- [ ] Hapus files yang tidak relevan
- [ ] Setup environment variables
- [ ] Buat basic pages (layout, home)
- [ ] Test development server
- [ ] Commit dan push changes
- [ ] Update README.md
- [ ] Test deployment

## 🚀 NEXT STEPS SETELAH RESTRUCTURING

1. **Setup API Integration** dengan main Laravel app
2. **Implement Authentication** untuk admin panel
3. **Optimize Virtual Tour Components**
4. **Setup Production Deployment**
5. **Performance Monitoring**

---

**Catatan**: Proses ini akan membuat virtual tour menjadi aplikasi Next.js yang standalone, lightweight, dan mudah di-maintain. Repository akan jauh lebih clean dan focused pada virtual tour functionality saja.