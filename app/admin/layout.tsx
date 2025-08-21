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

    // Skip auth check untuk halaman sign-in
    if (window.location.pathname === '/admin/sign-in') {
      setCheckingAuth(false);
      return;
    }
    
    const token = localStorage.getItem("adminToken");
    
    // Wajib login untuk semua halaman admin (tidak ada bypass dari web utama)
    if (!token) {
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
