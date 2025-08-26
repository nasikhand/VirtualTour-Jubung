import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers({ Accept: "application/json" });
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/vtour/menus/update-order`, {
      method: "POST",
      headers: (() => {
        const h = authHeaders(req);
        h.set("Content-Type", "application/json");
        return h;
      })(),
      body: JSON.stringify(body),
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Gagal update urutan menu" }, { status: 500 });
  }
}
