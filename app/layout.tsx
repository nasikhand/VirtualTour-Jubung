import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Virtual Tour Kebun Jubung",
  description: "Virtual Tour System for Kebun Jubung - PMM Jember",
  keywords: "virtual tour, kebun jubung, pmm jember, wisata virtual",
  authors: [{ name: "PMM Jember" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
