// virtual-tour/src/app/api/login/vtour-admin/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/login/vtour-admin`;

    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return NextResponse.json({ message: data.message || 'Login failed' }, { status: res.status });
    }
    
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('[API PROXY LOGIN ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error in Proxy' }, { status: 500 });
  }
}