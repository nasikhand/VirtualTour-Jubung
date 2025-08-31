import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Ambil token dari header Authorization
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' }, 
        { status: 401 }
      );
    }

    // Panggil Laravel endpoint untuk virtual tour admin (dengan auth)
    const res = await fetch(`${API_BASE}/api/vtour-admin/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating virtual tour admin profile:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' }, 
      { status: 500 }
    );
  }
}
