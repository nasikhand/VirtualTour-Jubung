import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers({ Accept: "application/json" });
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

// GET: semua hotspot untuk scene tertentu
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/scenes/${params.id}/hotspots`, {
      method: "GET",
      headers: authHeaders(req),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Laravel Error (GET scene hotspots):", data);
      return NextResponse.json({ message: "Gagal mengambil hotspot dari backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot get:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

// POST: tambah hotspot ke scene
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/scenes/${params.id}/hotspots`, {
      method: "POST",
      headers: (() => {
        const h = authHeaders(req);
        h.set("Content-Type", "application/json");
        return h;
      })(),
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Laravel Error (POST scene hotspot):", data);
      return NextResponse.json({ message: "Gagal menyimpan hotspot ke backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}
