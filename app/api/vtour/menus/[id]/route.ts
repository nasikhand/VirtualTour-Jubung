import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** PUT: update menu by id */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/menus/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (PUT menu):", data);
      return NextResponse.json({ message: "Gagal update menu" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (PUT menu):", error);
    return NextResponse.json({ message: "Gagal update menu" }, { status: 500 });
  }
}

/** DELETE: delete menu by id */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/menus/${params.id}`, { method: "DELETE" });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (DELETE menu):", data);
      return NextResponse.json({ message: "Gagal hapus menu" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (DELETE menu):", error);
    return NextResponse.json({ message: "Gagal hapus menu" }, { status: 500 });
  }
}
