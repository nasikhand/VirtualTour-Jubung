import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Logo upload started");
    
    const formData = await request.formData();
    const logoFile = formData.get('logo');
    
    if (!logoFile || !(logoFile instanceof File)) {
      return NextResponse.json({ 
        error: "File logo tidak ditemukan" 
      }, { status: 400 });
    }

    console.log("📁 File received:", {
      name: logoFile.name,
      size: logoFile.size,
      type: logoFile.type
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(logoFile.type)) {
      return NextResponse.json({ 
        error: "Format file harus JPG, PNG, atau WEBP" 
      }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (logoFile.size > 2 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "Ukuran file maksimal 2MB" 
      }, { status: 400 });
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('logo', logoFile);

    console.log("🎯 Sending to backend:", `${API_BASE}/api/vtour/settings/logo`);

    const response = await fetch(`${API_BASE}/api/vtour/settings/logo`, {
      method: "POST",
      body: backendFormData,
    });

    console.log("📡 Backend response:", {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", errorText);
      
      return NextResponse.json({ 
        error: "Gagal upload logo ke server",
        details: errorText.substring(0, 200)
      }, { status: response.status });
    }

    // Parse response
    const contentType = response.headers.get("content-type");
    let result;
    
    if (contentType?.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { message: text };
    }

    console.log("✅ Upload successful:", result);

    // Extract logo URL from response
    let logoUrl = null;
    if (result.data?.vtour_logo_url) {
      logoUrl = result.data.vtour_logo_url;
    } else if (result.data?.url) {
      logoUrl = result.data.url;
    } else if (result.vtour_logo_url) {
      logoUrl = result.vtour_logo_url;
    } else if (result.url) {
      logoUrl = result.url;
    }

    if (!logoUrl) {
      return NextResponse.json({ 
        error: "URL logo tidak ditemukan dalam response" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      logoUrl: logoUrl,
      message: "Logo berhasil diupload",
      // Tambahkan response yang konsisten dengan yang diharapkan frontend
      data: {
        vtour_logo_path: logoUrl,
        vtour_logo_url: logoUrl
      }
    });

  } catch (error) {
    console.error("💥 Upload error:", error);
    return NextResponse.json({ 
      error: "Terjadi kesalahan saat upload logo",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
