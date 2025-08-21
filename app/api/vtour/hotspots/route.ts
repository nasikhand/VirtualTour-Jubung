import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil semua hotspots
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = queryString ? `${apiUrl}/api/vtour/hotspots?${queryString}` : `${apiUrl}/api/vtour/hotspots`;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error("Laravel Error:", data);
        return NextResponse.json({ message: "Gagal mengambil daftar hotspots dari backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspots list:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

// POST: Buat hotspot baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/api/vtour/hotspots`, {
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
        return NextResponse.json({ message: "Gagal membuat hotspot di backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot create:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}