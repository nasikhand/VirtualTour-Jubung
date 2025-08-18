import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil daftar semua menu
export async function GET() {
  try {
    const res = await fetch(`${apiUrl}/vtour/menus`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data menu" }, { status: 500 });
  }
}

// POST: Tambah menu baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${apiUrl}/vtour/menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menambah menu" }, { status: 500 });
  }
}