import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Proxy untuk storage yang digunakan admin dan virtual tour
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await ctx.params;
    const imagePath = (params?.path ?? []).join("/");

    // Gunakan proxy yang sama dengan images
    const upstream = await fetch(`${API_BASE}/api/vtour/storage/${imagePath}`, { cache: "no-store" });

    if (!upstream.ok) {
      return new NextResponse("File tidak ditemukan di server backend", { status: upstream.status || 404 });
    }

    const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
    const arrayBuffer = await upstream.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Proxy Error (storage):", error);
    return new NextResponse("Error saat mengambil file", { status: 500 });
  }
}
