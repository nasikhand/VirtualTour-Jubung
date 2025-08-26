import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers({ Accept: "application/json" });
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

export async function GET(req: NextRequest) {
  console.log("🔍 Settings route accessed");
  console.log("🔍 API_BASE:", process.env.NEXT_PUBLIC_API_URL);
  
  try {
    const url = `${API_BASE}/api/vtour/settings`;
    console.log("🔍 Fetching from:", url);
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: authHeaders(req),
    });

    console.log("🔍 Response status:", res.status);

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Laravel Error (GET settings):", data);
      return NextResponse.json(
        { error: data?.message || "Gagal mengambil settings dari backend" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error di proxy API settings:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal pada proxy" }, { status: 500 });
  }
}
