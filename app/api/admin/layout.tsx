// app/admin/layout.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/sign-in");
    }
  }, [loading, user, router]);

  if (loading) return null;          // atau spinner
  if (!user) return null;            // guard ketika redirect dipicu
  return <>{children}</>;
}
