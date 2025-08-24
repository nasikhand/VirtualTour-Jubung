"use client";

import React, { ReactNode, FC, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarAdmin from "@/components/admin/sidebar-admin";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
};

const AdminLayoutContent: FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isSignInPage = pathname === '/admin/sign-in';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isSignInPage) {
      router.push("/admin/sign-in");
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

  if (isSignInPage || !isAuthenticated) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  // Tampilan layout admin lengkap untuk user yang sudah login
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SidebarAdmin />
      <main className="lg:pl-72">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default AdminLayout;