import { NextResponse } from 'next/server';

const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    // Memanggil endpoint getVtourSettings di backend Laravel
    const res = await fetch(`${laravelApiUrl}/vtour/settings`, {
        cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || 'Gagal mengambil settings dari backend' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error di proxy API settings:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal pada proxy' }, { status: 500 });
  }
}