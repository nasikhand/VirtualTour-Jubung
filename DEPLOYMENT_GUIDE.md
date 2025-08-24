# 🚀 PANDUAN DEPLOYMENT KE JAGOAN HOSTING

## 📋 PREREQUISITES

### 1. Repository Setup
- ✅ Virtual Tour: https://github.com/nasikhand/VirtualTour-Jubung (main branch)
- ✅ Web Utama: https://github.com/nasikhand/sistem-informasi-manajemen_PMM-JEMBER (branch: phase-1/feat-travel-map-virtual-tour)

### 2. Jagoan Hosting Setup
- ✅ Akun Jagoan Hosting
- ✅ Subdomain: `vtour.kebunjubung.com` (untuk virtual tour)
- ✅ Subdomain: `kebunjubung.com` (untuk web utama)
- ✅ Database MySQL

## 🔧 STEP-BY-STEP DEPLOYMENT

### **STEP 1: PUSH KE GITHUB**

#### Virtual Tour Repository:
```bash
cd virtual-tour
git add .
git commit -m "feat: fix drag mode and prepare for deployment"
git push origin main
```

#### Web Utama Repository:
```bash
cd ../frontend
git add .
git commit -m "feat: integrate virtual tour and prepare for deployment"
git push origin phase-1/feat-travel-map-virtual-tour
```

### **STEP 2: JAGOAN HOSTING SETUP**

#### 2.1 Buat Database
1. Login ke Jagoan Hosting
2. Buat database MySQL baru
3. Catat: host, username, password, database_name

#### 2.2 Upload Database
1. Import file `kebun_jubung (3).sql` ke database
2. Jalankan migration dan seeder:
```sql
-- Jalankan di phpMyAdmin atau MySQL console
USE your_database_name;
SOURCE kebun_jubung.sql;
```

#### 2.3 Setup Environment Variables

**Virtual Tour (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.kebunjubung.com/api
NEXT_PUBLIC_APP_URL=https://vtour.kebunjubung.com
NEXT_PUBLIC_VIRTUAL_TOUR_ASSETS_URL=/assets/virtual-tour
NEXT_PUBLIC_PANNELLUM_CDN=https://cdn.jsdelivr.net/npm/pannellum@2.5.6
DATABASE_URL=mysql://username:password@host:port/database_name
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

**Web Utama (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.kebunjubung.com/api
NEXT_PUBLIC_APP_URL=https://kebunjubung.com
NEXT_PUBLIC_VTOUR_URL=https://vtour.kebunjubung.com
DATABASE_URL=mysql://username:password@host:port/database_name
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### **STEP 3: DEPLOY BACKEND (LARAVEL)**

#### 3.1 Upload Backend
1. Upload folder `backend/` ke hosting
2. Set document root ke `backend/public/`

#### 3.2 Konfigurasi Backend
```bash
# Di server hosting
cd backend
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 3.3 Setup Database Backend
```bash
# Update .env dengan database credentials
php artisan migrate
php artisan db:seed
php setup_admin_credentials.php
```

### **STEP 4: DEPLOY VIRTUAL TOUR**

#### 4.1 Build Virtual Tour
```bash
cd virtual-tour
npm install
npm run build
```

#### 4.2 Upload ke Hosting
1. Upload hasil build ke subdomain `vtour.kebunjubung.com`
2. Set document root ke folder build

### **STEP 5: DEPLOY WEB UTAMA**

#### 5.1 Build Web Utama
```bash
cd frontend
npm install
npm run build
```

#### 5.2 Upload ke Hosting
1. Upload hasil build ke domain utama `kebunjubung.com`
2. Set document root ke folder build

## 🔗 KONFIGURASI DOMAIN

### Virtual Tour
- **Domain:** vtour.kebunjubung.com
- **Type:** Subdomain
- **Document Root:** /public_html/vtour

### Web Utama
- **Domain:** kebunjubung.com
- **Type:** Main Domain
- **Document Root:** /public_html

### API Backend
- **Domain:** api.kebunjubung.com
- **Type:** Subdomain
- **Document Root:** /public_html/api

## 🗄️ DATABASE MIGRATION

### 1. Import Database
```sql
-- Di phpMyAdmin
CREATE DATABASE kebun_jubung_production;
USE kebun_jubung_production;
SOURCE kebun_jubung.sql;
```

### 2. Update Credentials
```bash
# Update .env files dengan database baru
DATABASE_HOST=your_host
DATABASE_PORT=3306
DATABASE_DATABASE=kebun_jubung_production
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

## 🔐 SECURITY SETUP

### 1. SSL Certificates
- ✅ Enable SSL untuk semua subdomain
- ✅ Force HTTPS redirect

### 2. Environment Variables
- ✅ JWT_SECRET yang kuat
- ✅ Database credentials yang aman
- ✅ API keys yang terenkripsi

### 3. File Permissions
```bash
# Set proper permissions
chmod 755 public_html
chmod 644 .env
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

## 🧪 TESTING POST-DEPLOYMENT

### 1. Virtual Tour
- ✅ https://vtour.kebunjubung.com
- ✅ Admin login: vtouradmin / vtouradmin123
- ✅ Hotspot placement berfungsi
- ✅ Drag mode berfungsi

### 2. Web Utama
- ✅ https://kebunjubung.com
- ✅ Admin login: admin / passwordadmin
- ✅ Virtual tour integration

### 3. API Backend
- ✅ https://api.kebunjubung.com/api/health
- ✅ Database connection
- ✅ Authentication endpoints

## 🚨 TROUBLESHOOTING

### Common Issues:
1. **CORS Error:** Update CORS config di backend
2. **Database Connection:** Check credentials dan firewall
3. **Build Error:** Check Node.js version compatibility
4. **SSL Issues:** Verify certificate installation

### Logs Location:
- **Virtual Tour:** /var/log/vtour/
- **Web Utama:** /var/log/web/
- **Backend:** /var/log/laravel/

## 📞 SUPPORT

Jika ada masalah deployment:
1. Check error logs
2. Verify environment variables
3. Test database connection
4. Contact hosting support jika diperlukan

---

**Status:** Ready for Deployment ✅
**Last Updated:** January 2025
**Version:** 1.0.0
