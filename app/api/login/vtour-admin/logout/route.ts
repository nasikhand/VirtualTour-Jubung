import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
    const url = `${base}/api/login/vtour-admin/logout`;

    const authToken = request.headers.get("authorization") ?? "";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: authToken,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API PROXY LOGOUT ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error in Proxy" }, { status: 500 });
  }
}
