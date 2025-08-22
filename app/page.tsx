import Link from 'next/link'
import { MapPin, Camera, Users, Leaf } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <Leaf className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Virtual Tour Kebun Jubung
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Jelajahi keindahan alam Kebun Jubung melalui pengalaman virtual tour yang menakjubkan. 
            Rasakan sensasi berjalan-jalan di tengah kehijauan tanpa batas waktu dan tempat.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/virtual-tour" 
              className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg font-semibold"
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Mulai Virtual Tour
            </Link>
            <Link 
              href="/admin" 
              className="bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg inline-flex items-center gap-3 text-lg font-semibold"
            >
              <Users className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Eksplorasi Interaktif</h3>
            <p className="text-gray-600">Jelajahi setiap sudut kebun dengan navigasi 360° yang mudah dan intuitif</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Camera className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Kualitas HD</h3>
            <p className="text-gray-600">Nikmati visual berkualitas tinggi yang memukau dengan detail yang tajam</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
              <Leaf className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Ramah Lingkungan</h3>
            <p className="text-gray-600">Kunjungi kebun tanpa meninggalkan jejak karbon, kapan saja dan dimana saja</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white/30 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 Virtual Tour Kebun Jubung. Dibuat dengan ❤️ untuk pelestarian alam.</p>
        </div>
      </div>
    </div>
  )
}
