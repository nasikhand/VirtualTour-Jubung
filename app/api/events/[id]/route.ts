import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Ambil detail event by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${apiUrl}/api/events/${params.id}`);
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: "Gagal ambil detail event" }, { status: res.status });
    }
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return NextResponse.json({ message: "Gagal ambil detail event" }, { status: 500 });
  }
}