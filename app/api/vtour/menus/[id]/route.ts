import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// PUT: Update menu
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`${apiUrl}/api/vtour-menus/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update menu' }, { status: 500 });
  }
}

// DELETE: Hapus menu
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await fetch(`${apiUrl}/api/vtour-menus/${params.id}`, {
            method: 'DELETE',
        });

        // Delete di Laravel mengembalikan status 204 No Content
        if (res.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ message: 'Gagal hapus menu' }, { status: 500 });
    }
}