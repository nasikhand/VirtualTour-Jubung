import Link from 'next/link'

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Virtual Tour Kebun Jubung
          </h1>
          <p className="text-gray-600">
            Selamat datang di Virtual Tour Kebun Jubung. Pilih scene untuk memulai penjelajahan virtual.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Scene Virtual Tour</h2>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Virtual tour sedang dalam pengembangan.
            </p>
            <p className="text-sm text-gray-400">
              Silakan gunakan admin panel untuk mengelola scene dan hotspot.
            </p>
            <Link 
              href="/admin" 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
            >
              Buka Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}