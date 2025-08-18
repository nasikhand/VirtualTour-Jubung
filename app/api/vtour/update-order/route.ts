// file: frontend/app/api/vtour/menus/update-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${apiUrl}/vtour/menus/update-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update urutan menu' }, { status: 500 });
  }
}