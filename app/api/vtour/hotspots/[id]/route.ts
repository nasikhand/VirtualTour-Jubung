import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// DELETE: Hapus hotspot berdasarkan ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hotspotId = params.id;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/vtour/hotspots/${hotspotId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error("Laravel Error:", data);
        return NextResponse.json({ message: "Gagal menghapus hotspot dari backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot delete:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

// PUT: Update hotspot berdasarkan ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const hotspotId = params.id;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/vtour/hotspots/${hotspotId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error("Laravel Error:", data);
        return NextResponse.json({ message: "Gagal mengupdate hotspot di backend" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error di API proxy hotspot update:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}

// GET: Ambil hotspot berdasarkan ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hotspotId = params.id;

    // Meneruskan permintaan ke backend Laravel
    const res = await fetch(`${apiUrl}/vtour/hotspots/${hotspotId}`, {
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