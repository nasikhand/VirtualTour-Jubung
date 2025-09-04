import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers({ Accept: "application/json" });
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

// GET: daftar scene (pagination)
export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";
    const perPage = req.nextUrl.searchParams.get("per_page") || "";
    const url = `${API_BASE}/api/vtour/scenes?page=${encodeURIComponent(page)}${perPage ? `&per_page=${encodeURIComponent(perPage)}` : ""}`;

    const res = await fetch(url, { headers: authHeaders(req), cache: "no-store" });
    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Gagal ambil list scene:", error);
    return NextResponse.json({ message: "Gagal ambil data scene" }, { status: 500 });
  }
}

// POST: tambah scene (multipart form-data)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await fetch(`${API_BASE}/api/vtour/scenes`, {
      method: "POST",
      // penting: JANGAN set Content-Type manual untuk FormData
      headers: authHeaders(req),
      body: formData,
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      console.error("Laravel balas bukan JSON:", text);
      return NextResponse.json({ message: "Backend balas bukan JSON" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Gagal tambah scene:", error);
    return NextResponse.json({ message: "Gagal tambah scene" }, { status: 500 });
  }
}
