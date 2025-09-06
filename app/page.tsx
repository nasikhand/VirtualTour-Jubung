'use client';

import Link from 'next/link'
import { MapPin, Camera, Users, Leaf, Play, ArrowRight, Star, Globe, Headphones } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Floating cursor effect */}
      <div 
        className="fixed w-4 h-4 bg-emerald-400/30 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: 'scale(1)'
        }}
      />
      
      {/* Interactive background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-emerald-300/20 rounded-full animate-pulse transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        ))}
      </div>
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>
      
      {/* Hero Section */}
      <div className={`container mx-auto px-4 py-20 relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="text-center mb-16">
          {/* Animated logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-8 shadow-lg hover:scale-110 transition-transform duration-300">
            <Leaf className="w-12 h-12 text-emerald-600 animate-pulse" />
          </div>
          
          {/* Main title with enhanced styling */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
            Virtual Tour
            <br />
            <span className="text-4xl md:text-6xl">Wisata Jubung</span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Jelajahi keindahan alam desa Jubung melalui pengalaman virtual tour yang menakjubkan. 
            Rasakan sensasi berjalan-jalan di tengah kehijauan tanpa batas waktu dan tempat.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200 flex items-center gap-2">
              <Globe size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">360° Interaktif</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200 flex items-center gap-2">
              <Headphones size={16} className="text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Audio Narasi</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-200 flex items-center gap-2">
              <Star size={16} className="text-cyan-600" />
              <span className="text-sm font-medium text-gray-700">Kualitas HD</span>
            </div>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link 
              href="/virtual-tour" 
              className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-4 text-xl font-bold overflow-hidden"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(1.05) translateY(-2px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `scale(1) translateY(0px)`;
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Play className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10" />
              <span className="relative z-10">Mulai Virtual Tour</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            
            <Link 
              href="/admin" 
              className="group bg-white/90 backdrop-blur-sm text-gray-700 px-10 py-5 rounded-2xl hover:bg-white transition-all duration-300 border-2 border-gray-200 hover:border-emerald-300 shadow-lg hover:shadow-xl inline-flex items-center gap-4 text-xl font-bold transform hover:scale-105"
            >
              <Users className="w-6 h-6 group-hover:text-emerald-600 transition-colors" />
              <span className="group-hover:text-emerald-600 transition-colors">Admin Panel</span>
            </Link>
          </div>
        </div>
        
        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-emerald-200 transform hover:-translate-y-2 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors">Eksplorasi Interaktif</h3>
            <p className="text-gray-600 leading-relaxed mb-4">Jelajahi setiap sudut wisata dengan navigasi 360° yang mudah dan intuitif. Rasakan pengalaman immersive yang tak terlupakan.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium">
              <Globe size={16} />
              <span>Navigasi 360°</span>
            </div>
          </div>
          
          <div className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-teal-200 transform hover:-translate-y-2 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0.4s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Camera className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors">Kualitas HD</h3>
            <p className="text-gray-600 leading-relaxed mb-4">Nikmati visual berkualitas tinggi yang memukau dengan detail yang tajam dan warna yang hidup.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
              <Star size={16} />
              <span>Resolusi Tinggi</span>
            </div>
          </div>
          
          <div className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-cyan-200 transform hover:-translate-y-2 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0.6s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Leaf className="w-10 h-10 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-cyan-600 transition-colors">Ramah Lingkungan</h3>
            <p className="text-gray-600 leading-relaxed mb-4">Kunjungi wisata tanpa meninggalkan jejak karbon, kapan saja dan dimana saja dengan teknologi virtual.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-600 font-medium">
              <Headphones size={16} />
              <span>Audio Narasi</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <div className="bg-white/40 backdrop-blur-md border-t border-white/30 py-12 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Virtual Tour Wisata Jubung
              </h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Menjelajahi keindahan alam melalui teknologi virtual reality untuk pengalaman yang tak terlupakan
            </p>
          </div>
          
          {/* Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
             <div className={`text-center group cursor-pointer transition-all duration-300 hover:scale-110 ${
               isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
             }`} style={{ transitionDelay: '0.8s' }}>
               <div className="text-2xl font-bold text-emerald-600 mb-1 group-hover:text-emerald-700 transition-colors duration-300">360°</div>
               <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Panorama</div>
             </div>
             <div className={`text-center group cursor-pointer transition-all duration-300 hover:scale-110 ${
               isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
             }`} style={{ transitionDelay: '0.9s' }}>
               <div className="text-2xl font-bold text-teal-600 mb-1 group-hover:text-teal-700 transition-colors duration-300">HD</div>
               <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Kualitas</div>
             </div>
             <div className={`text-center group cursor-pointer transition-all duration-300 hover:scale-110 ${
               isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
             }`} style={{ transitionDelay: '1.0s' }}>
               <div className="text-2xl font-bold text-cyan-600 mb-1 group-hover:text-cyan-700 transition-colors duration-300">24/7</div>
               <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Akses</div>
             </div>
             <div className={`text-center group cursor-pointer transition-all duration-300 hover:scale-110 ${
               isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
             }`} style={{ transitionDelay: '1.1s' }}>
               <div className="text-2xl font-bold text-emerald-600 mb-1 group-hover:text-emerald-700 transition-colors duration-300">∞</div>
               <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Eksplorasi</div>
             </div>
           </div>
          
          <div className="text-center border-t border-white/20 pt-6">
            <p className="text-gray-600 mb-2">
              © 2025 Virtual Tour Wisata Jubung. Dibuat dengan 
              <span className="text-red-500 mx-1">❤️</span> 
              untuk pelestarian alam.
            </p>
            <p className="text-sm text-gray-500">
              Teknologi Virtual Reality • Ramah Lingkungan • Akses Universal
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-200/20 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
