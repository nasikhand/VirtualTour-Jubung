import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil semua hotspot dari scene tertentu
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sceneId = params.id;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/api/vtour/scenes/${sceneId}/hotspots`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error("Laravel Error:", data);
        return NextResponse.json({ message: "Gagal mengambil hotspot dari backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot get:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

// POST: Tambah hotspot baru ke sebuah scene
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const sceneId = params.id;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/api/vtour/scenes/${sceneId}/hotspots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error("Laravel Error:", data);
        return NextResponse.json({ message: "Gagal menyimpan hotspot ke backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}