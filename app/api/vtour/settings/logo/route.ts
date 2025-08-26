import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function authHeaders(req: NextRequest) {
  const h = new Headers();
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  // Jangan set Content-Type manual untuk FormData
  return h;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const res = await fetch(`${API_BASE}/api/vtour/settings/logo`, {
      method: "POST",
      headers: authHeaders(request),
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error dari Laravel:", errorText);
      return NextResponse.json(
        { error: "Terjadi kesalahan di server backend.", details: errorText.substring(0, 500) },
        { status: res.status }
      );
    }

    // bisa JSON / teks
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      return new NextResponse(text, { status: res.status });
    }
  } catch (error) {
    console.error("Error di proxy API upload logo:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal pada proxy" }, { status: 500 });
  }
}
