import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Proxy file image dari Laravel:
 * - Backend route contoh: GET /api/vtour/storage/{path}
 * - Di sini kita pastikan base sudah termasuk /api → jadi pakai `${API_BASE}/vtour/storage/...`
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> } // Next 15: params bisa Promise
) {
  try {
    const params = await ctx.params;
    const imagePath = (params?.path ?? []).join("/");

    const upstream = await fetch(`${API_BASE}/api/vtour/storage/${imagePath}`, { cache: "no-store" });

    if (!upstream.ok) {
      return new NextResponse("Gambar tidak ditemukan di server backend", { status: upstream.status || 404 });
    }

    const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
    const arrayBuffer = await upstream.arrayBuffer(); // gunakan arrayBuffer agar kompatibel di Edge runtimes juga
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Proxy Error (image):", error);
    return new NextResponse("Error saat mengambil gambar", { status: 500 });
  }
}
