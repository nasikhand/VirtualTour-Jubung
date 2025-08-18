import { NextRequest, NextResponse } from 'next/server';

const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // ✅ PERBAIKAN: Await params untuk Next.js 15 compatibility
    const params = await context.params;
    const imagePath = params.path.join('/');
    
    const response = await fetch(`${laravelApiUrl}/vtour/storage/${imagePath}`);

    if (!response.ok) {
      return new NextResponse('Gambar tidak ditemukan di server backend', { status: 404 });
    }
    
    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    });

  } catch (error) {
    console.error('Error di proxy gambar:', error);
    return new NextResponse('Error saat mengambil gambar', { status: 500 });
  }
}