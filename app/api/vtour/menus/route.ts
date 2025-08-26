import { NextResponse, NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** GET: menus */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/menus`, { cache: "no-store" });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (GET menus):", data);
      return NextResponse.json({ message: "Gagal mengambil data menu" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (GET menus):", error);
    return NextResponse.json({ message: "Gagal mengambil data menu" }, { status: 500 });
  }
}

/** POST: create menu */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (POST menu):", data);
      return NextResponse.json({ message: "Gagal menambah menu" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (POST menu):", error);
    return NextResponse.json({ message: "Gagal menambah menu" }, { status: 500 });
  }
}
