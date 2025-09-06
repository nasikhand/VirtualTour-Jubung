// File: app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
// (Opsional) Anda bisa menghapus AuthContext jika benar-benar tidak dipakai lagi.
// import { useAuth } from "@/context/AuthContext";
import SidebarAdmin from "@/components/admin/sidebar-admin";

const SIGN_IN_PATHS = ["/admin/sign-in"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // const { user, loading } = useAuth(); // ❌ Dinonaktifkan: kita tidak pakai auth sama sekali
  const pathname = usePathname();

  // ❌ Blokir seluruh mekanisme auth:
  // - Tidak ada status loading
  // - Tidak ada redirect ke /admin/sign-in
  // - Semua halaman diperlakukan "authenticated"
  const isAuthenticated = true;
  const isLoading = false;
  const isSignInPage = !!pathname && SIGN_IN_PATHS.includes(pathname);

  // ❌ Hapus/komentari efek redirect (tidak dipakai)
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated && !isSignInPage) {
  //     router.replace("/admin/sign-in");
  //   }
  // }, [isLoading, isAuthenticated, isSignInPage]);

  // ❌ Tidak ada spinner loading berbasis auth
  // if (isLoading) { ... }

  // ❌ Tidak ada cabang "render sign-in tanpa sidebar"
  // if (isSignInPage || !isAuthenticated) { ... }

  // ✅ Selalu render layout admin penuh
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SidebarAdmin />
      <main className="lg:pl-64">
        <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 pt-16 lg:pt-4">
          {children}
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
