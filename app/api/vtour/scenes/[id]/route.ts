import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers({ Accept: "application/json" });
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

// GET: detail scene by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/scenes/${params.id}`, {
      headers: authHeaders(req),
      cache: "no-store",
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ message: "Gagal ambil detail scene" }, { status: res.status });
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Error fetching scene by ID:", error);
    return NextResponse.json({ message: "Gagal ambil detail scene" }, { status: 500 });
  }
}

// DELETE: hapus scene
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/api/vtour/scenes/${params.id}`, {
      method: "DELETE",
      headers: authHeaders(req),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ message: "Gagal hapus scene" }, { status: res.status });
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal hapus scene" }, { status: 500 });
  }
}

// POST (method spoof PUT): update scene by ID (form-data)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    formData.set("_method", "PUT"); // spoof

    const res = await fetch(`${API_BASE}/api/vtour/scenes/${params.id}`, {
      method: "POST",
      headers: authHeaders(req), // biarkan boundary ditambah otomatis
      body: formData,
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal update scene" }, { status: 500 });
  }
}
