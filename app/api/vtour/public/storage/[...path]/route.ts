import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Public proxy untuk storage virtual tour (tanpa authentication)
 * Bisa diakses oleh siapa saja, termasuk setelah logout
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await ctx.params;
    const imagePath = (params?.path ?? []).join("/");

    // Gunakan public endpoint dari Laravel backend
    const upstream = await fetch(`${API_BASE}/api/vtour/public/storage/${imagePath}`, { 
      cache: "no-store" 
    });

    if (!upstream.ok) {
      return new NextResponse("File tidak ditemukan", { status: upstream.status || 404 });
    }

    const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
    const arrayBuffer = await upstream.arrayBuffer();
    
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: { 
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache 1 jam untuk public access
        "Access-Control-Allow-Origin": "*" // Allow semua origin
      },
    });
    
  } catch (error) {
    console.error("Public Storage Proxy Error:", error);
    return new NextResponse("Error saat mengambil file", { status: 500 });
  }
}
