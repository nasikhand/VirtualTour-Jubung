import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: Request) {
  try {
    // Ambil token dari header Authorization
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' }, 
        { status: 401 }
      );
    }

    // Panggil Laravel endpoint untuk virtual tour admin profile (dengan auth)
    const res = await fetch(`${API_BASE}/api/vtour-admin/profile`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Gagal mengambil profil admin' }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching virtual tour admin profile:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' }, 
      { status: 500 }
    );
  }
}
