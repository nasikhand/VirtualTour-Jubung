"use client";

import React, { ReactNode, FC, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/components/admin/sidebar-admin";
import toast, { Toaster } from "react-hot-toast";
import { authAPI } from "@/lib/api-client";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Session timeout duration (30 menit = 1800000 ms)
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  
  // Fungsi untuk logout otomatis
  const handleAutoLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    toast.error("Sesi telah berakhir. Silakan login kembali.");
    router.push("/admin/sign-in");
  }, [router]);
  
  // Fungsi untuk reset session timeout
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    const newTimeout = setTimeout(handleAutoLogout, SESSION_TIMEOUT);
    setSessionTimeout(newTimeout);
  }, [handleAutoLogout, SESSION_TIMEOUT]);
  
  // Event listeners untuk aktivitas user
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeout = () => {
      // Hanya reset jika user sudah login dan bukan di halaman sign-in
      const token = localStorage.getItem("adminToken");
      if (token && !window.location.pathname.includes('/sign-in')) {
        resetSessionTimeout();
      }
    };
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });
    
    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, [resetSessionTimeout, sessionTimeout]);

  useEffect(() => {
    // Skip auth check untuk halaman sign-in
    if (window.location.pathname === '/admin/sign-in') {
      setCheckingAuth(false);
      return;
    }
    
    const validateAuth = async () => {
      const token = localStorage.getItem("adminToken");
      
      // Jika tidak ada token atau masih dummy token
      if (!token || token === "dummy-admin-token") {
        localStorage.removeItem("adminToken");
        toast.error("Silakan login terlebih dahulu.");
        router.push("/admin/sign-in");
        return;
      }
      
      // Validasi token dengan backend
      try {
        const validation = await authAPI.validateToken();
        if (!validation.valid) {
          localStorage.removeItem("adminToken");
          toast.error("Sesi telah berakhir. Silakan login kembali.");
          router.push("/admin/sign-in");
          return;
        }
        
        // Token valid, lanjutkan
        setCheckingAuth(false);
        // Start session timeout untuk user yang sudah login
        resetSessionTimeout();
      } catch (error) {
        localStorage.removeItem("adminToken");
        toast.error("Terjadi kesalahan validasi. Silakan login kembali.");
        router.push("/admin/sign-in");
      }
    };
    
    validateAuth();
  }, [router, resetSessionTimeout]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-sm">Memeriksa autentikasi...</p>
      </div>
    );
  }

  // Don't show sidebar on sign-in page
  const isSignInPage = typeof window !== 'undefined' && window.location.pathname === '/admin/sign-in';

  if (isSignInPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <main className="flex-1 ml-64 p-6 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default AdminLayout;
