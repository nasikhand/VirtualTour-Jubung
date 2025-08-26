import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** GET: hotspot by id */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/hotspots/${params.id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (GET hotspot by id):", data);
      return NextResponse.json({ message: "Gagal mengambil hotspot dari backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (GET hotspot by id):", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

/** PUT: update hotspot by id */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/hotspots/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (PUT hotspot):", data);
      return NextResponse.json({ message: "Gagal mengupdate hotspot di backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (PUT hotspot):", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

/** DELETE: delete hotspot by id */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/hotspots/${params.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (DELETE hotspot):", data);
      return NextResponse.json({ message: "Gagal menghapus hotspot dari backend" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (DELETE hotspot):", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}
