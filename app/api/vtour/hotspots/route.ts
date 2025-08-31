import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** GET: list hotspots */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString();
    
    // Jika ada parameter scene_id, gunakan endpoint scenes.hotspots
    const sceneId = searchParams.get('scene_id');
    let url: string;
    
    if (sceneId) {
      url = `${API_BASE}/api/vtour/scenes/${sceneId}/hotspots`;
    } else {
      // Jika tidak ada scene_id, gunakan endpoint hotspots baru
      url = `${API_BASE}/api/vtour/hotspots`;
    }
    
    console.log('Fetching hotspots from:', url); // Debug log

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    console.log('Hotspots response:', data); // Debug log
    
    if (!res.ok) {
      console.error("Laravel Error (GET hotspots):", data);
      return NextResponse.json({ message: "Gagal mengambil daftar hotspots dari backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (GET hotspots):", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

/** POST: create hotspot */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/hotspots`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (POST hotspot):", data);
      return NextResponse.json({ message: "Gagal membuat hotspot di backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (POST hotspot):", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}
