"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, User, ArrowRight, Monitor, Smartphone } from "lucide-react";

export default function AdminSignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Captcha state
  const [captcha, setCaptcha] = useState({ targetNumber: 0, answer: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  
  // Generate captcha
  const generateCaptcha = () => {
    const targetNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    setCaptcha({ targetNumber, answer: targetNumber.toString() });
    setCaptchaInput("");
  };

  useEffect(() => { 
    setIsClient(true); 
    generateCaptcha();
    
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 1024; // Less than 1024px is considered mobile/tablet
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    
    // Validasi captcha
    if (captchaInput !== captcha.answer) {
      toast.error("Captcha salah, silakan coba lagi");
      generateCaptcha();
      return;
    }
    setIsLoading(true);
    try {
      const ok = await login(formData.username, formData.password);
      if (ok) {
        toast.success("Login berhasil!");
        // 📍 Arahkan ke dashboard yang valid di project kamu
        router.replace("/admin"); // ganti ke "/admin/virtual-tour" kalau itu dashboardmu
      } else {
        toast.error("Login gagal. Periksa kredensial atau coba lagi.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  // Mobile restriction screen
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500" />
        </div>
        
        <div className="relative w-full max-w-md z-10 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Akses Terbatas
            </h1>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Panel admin hanya dapat diakses melalui laptop atau desktop untuk keamanan dan pengalaman yang optimal.
            </p>
            
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <Monitor className="w-6 h-6" />
                <span className="text-sm">Minimal resolusi: 1024px</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Silakan akses menggunakan perangkat desktop atau laptop untuk melanjutkan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500" />
      </div>
      
      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Virtual Tour Admin
          </h1>
          <p className="text-gray-300 text-lg">Wisata Jubung System</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-200 text-center">Captcha - Ketik angka yang sama</label>
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-white/20 border border-white/30 rounded-lg px-4 py-2.5 text-white font-mono text-lg font-bold min-w-[100px] text-center shadow-lg">
                  {captcha.targetNumber}
                </div>
                <div className="text-white text-lg font-bold">=</div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-24 px-3 py-2.5 text-lg font-bold bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center shadow-lg"
                  placeholder="????"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200 text-sm shadow-lg"
                  title="Refresh Captcha"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-300 text-center">
              <span className="font-semibold text-blue-400">Demo Credentials:</span>
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              vtouradmin / vtouradmin123
            </p>
          </div> */}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            © 2025 Wisata Jubung System. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
