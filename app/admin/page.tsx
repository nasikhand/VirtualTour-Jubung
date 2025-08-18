import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminWelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Virtual Tour Kebun Jubung - Dashboard Administrasi</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Virtual Tour</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900">Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pengunjung</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Sections */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           {/* Management Spot/Hotspot */}
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center mb-4">
                 <div className="p-2 bg-red-100 rounded-lg">
                   <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 ml-3">Management Spot</h3>
               </div>
               <p className="text-gray-600 mb-4">Kelola hotspot dan titik interaktif dalam virtual tour</p>
               <div className="space-y-2">
                 <Link 
                   href="/admin/virtual-tour-hotspots" 
                   className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                 >
                   Kelola Hotspot
                 </Link>
                 <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                   Tambah Spot Baru
                 </button>
                 <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                   Preview Spot
                 </button>
               </div>
             </CardContent>
           </Card>

           {/* Management Tour */}
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center mb-4">
                 <div className="p-2 bg-green-100 rounded-lg">
                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 ml-3">Management Tour</h3>
               </div>
               <p className="text-gray-600 mb-4">Kelola scene dan navigasi virtual tour</p>
               <div className="space-y-2">
                 <Link 
                   href="/admin/virtual-tour-section" 
                   className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                 >
                   Kelola Scene
                 </Link>
                 <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">
                   Upload 360° Image
                 </button>
                 <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                   Atur Navigasi
                 </button>
               </div>
             </CardContent>
           </Card>

           {/* Virtual Tour Preview */}
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center mb-4">
                 <div className="p-2 bg-blue-100 rounded-lg">
                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 ml-3">Virtual Tour</h3>
               </div>
               <p className="text-gray-600 mb-4">Lihat dan test virtual tour yang telah dibuat</p>
               <div className="space-y-2">
                 <Link 
                   href="/virtual-tour" 
                   className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Lihat Virtual Tour
                 </Link>
                 <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
                   Test Mode
                 </button>
                 <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                   Export Tour
                 </button>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Analytics & Settings */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Reports</h3>
               <p className="text-gray-600 mb-4">Statistik pengunjung dan laporan interaksi</p>
               <div className="space-y-2">
                 <button className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors">
                   Statistik Pengunjung
                 </button>
                 <button className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors">
                   Laporan Hotspot
                 </button>
                 <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                   Export Data
                 </button>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Sistem</h3>
               <p className="text-gray-600 mb-4">Konfigurasi dan pengaturan aplikasi</p>
               <div className="space-y-2">
                 <button className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors">
                   Pengaturan Umum
                 </button>
                 <button className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors">
                   Manajemen User
                 </button>
                 <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                   Backup Data
                 </button>
               </div>
             </CardContent>
           </Card>
         </div>

        {/* Development Notice */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Status Pengembangan</h4>
                  <p className="text-gray-600">Aplikasi ini sedang dalam tahap pengembangan. Fitur-fitur admin akan ditambahkan secara bertahap.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
