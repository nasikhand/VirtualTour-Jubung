import Link from 'next/link';

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Virtual Tour Kebun Jubung
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Jelajahi keindahan Kebun Jubung melalui pengalaman virtual tour 360° yang menakjubkan.
          </p>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                🚧 Dalam Pengembangan
              </h2>
              <p className="text-yellow-700">
                Virtual tour sedang dalam tahap pengembangan. Fitur akan segera tersedia setelah integrasi dengan backend selesai.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ← Kembali ke Beranda
              </Link>
              
              <Link 
                href="/admin"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Panel Admin →
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>PMM Jember - Virtual Tour System</p>
          </div>
        </div>
      </div>
    </div>
  );
}