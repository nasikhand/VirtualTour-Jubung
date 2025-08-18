"use client";

import React, { ReactNode, FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/components/admin/sidebar-admin";
import toast, { Toaster } from "react-hot-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // ✅ kalau buka halaman non-admin → hapus token admin
    if (!window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem("adminToken");
    }

    // Check if accessed from main web app (referrer check)
    const referrer = document.referrer;
    const isFromMainApp = referrer.includes('localhost:3000');
    
    const token = localStorage.getItem("adminToken");
    
    // Skip authentication if accessed from main web app
    if (isFromMainApp) {
      // Set a temporary token for main app access
      localStorage.setItem("adminToken", "main-app-access-token");
      setCheckingAuth(false);
    } else if (!token) {
      toast.error("Silakan login terlebih dahulu.");
      router.push("/admin/sign-in");
    } else {
      setCheckingAuth(false); // token ada, lanjut render
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-sm">Memeriksa autentikasi...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default AdminLayout;
