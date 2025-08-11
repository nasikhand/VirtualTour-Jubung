import { NextRequest, NextResponse } from 'next/server';

const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    // Ambil FormData langsung dari request
    const formData = await request.formData();

    // Teruskan FormData ke backend Laravel
    const res = await fetch(`${laravelApiUrl}/api/vtour/settings/logo`, {
      method: 'POST',
      body: formData,
      // Penting: Jangan set Content-Type header secara manual saat mengirim FormData,
      // browser akan menanganinya secara otomatis beserta boundary-nya.
    });

    // Cek apakah response dari Laravel adalah JSON
    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType || !contentType.includes('application/json')) {
      const errorText = await res.text();
      console.error("Error dari Laravel:", errorText);
      return NextResponse.json({ error: "Terjadi kesalahan di server backend.", details: errorText.substring(0, 500) }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error di proxy API upload logo:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal pada proxy' }, { status: 500 });
  }
}