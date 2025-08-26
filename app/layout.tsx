// File: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Virtual Tour Kebun Jubung",
  description: "Sistem Virtual Tour 360° untuk Kebun Jubung - PMM Jember",
  keywords: ["virtual tour", "360°", "kebun jubung", "pmm jember", "panorama"],
  authors: [{ name: "PMM Jember" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* 🔑 Bungkus seluruh app dengan AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
