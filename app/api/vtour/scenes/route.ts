import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil daftar scene (dengan paginasi)
export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";
    const res = await fetch(`${apiUrl}/vtour/scenes?page=${page}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Gagal ambil list scene:", error);
    return NextResponse.json({ message: "Gagal ambil data scene" }, { status: 500 });
  }
}

// POST: Tambah scene baru
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await fetch(`${apiUrl}/vtour/scenes`, {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
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