import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil detail scene by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${apiUrl}/api/vtour/scenes/${params.id}`);
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: "Gagal ambil detail scene" }, { status: res.status });
    }
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Error fetching scene by ID:", error);
    return NextResponse.json({ message: "Gagal ambil detail scene" }, { status: 500 });
  }
}

// DELETE: Hapus scene by ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${apiUrl}/api/vtour/scenes/${params.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: "Gagal hapus scene" }, { status: res.status });
    }
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal hapus scene" }, { status: 500 });
  }
}

// POST (untuk update): Update scene by ID
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
     // Tambahkan _method untuk memberi tahu Laravel ini adalah request PUT/PATCH
    formData.append('_method', 'PUT');

    const res = await fetch(`${apiUrl}/api/vtour/scenes/${params.id}`, {
      method: "POST",
      body: formData,
    });
    
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal update scene" }, { status: 500 });
  }
}