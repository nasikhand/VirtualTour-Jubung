// File: app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import SidebarAdmin from "@/components/admin/sidebar-admin";

const SIGN_IN_PATHS = ["/admin/sign-in", "/admin/virtual-tour/sign-in"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;
  const isLoading = loading;
  const isSignInPage = !!pathname && SIGN_IN_PATHS.includes(pathname);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isSignInPage) {
      // 📍 Sesuaikan path sign-in yang kamu pakai (kamu pakai /admin/virtual-tour/sign-in)
      router.replace("/admin/virtual-tour/sign-in");
    }
  }, [isLoading, isAuthenticated, isSignInPage, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Memeriksa autentikasi...</p>
      </div>
    );
  }

  // Halaman sign-in: render apa adanya (tanpa sidebar)
  if (isSignInPage || !isAuthenticated) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  // Layout admin penuh untuk user yang sudah login
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SidebarAdmin />
      <main className="lg:pl-72">
        <div className="px-4 py-4 sm:px-6 lg:px-8">{children}</div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
