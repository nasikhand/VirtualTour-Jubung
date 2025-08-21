// file: frontend/lib/data/virtual-tour.ts
import { VtourMenu, Scene } from "@/types/virtual-tour";

// URL untuk Server Component (memerlukan path absolut)
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

// URL untuk Client Component (bisa relatif)
const apiBase = '/api/vtour';

// --- FUNGSI UNTUK SCENES ---
export async function getScenesPaginated(page = 1) {
  // Fungsi ini kemungkinan dipanggil dari client, jadi kita gunakan path relatif
  const res = await fetch(`${apiBase}/scenes?page=${page}`);
  if (!res.ok) throw new Error(`Gagal memuat scene`);
  return res.json();
}

export async function getSceneById(id: string | number) {
  // Fungsi ini kemungkinan dipanggil dari server component, jadi kita gunakan path absolut
  const res = await fetch(`${appUrl}${apiBase}/scenes/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Gagal memuat scene`);
  }
  return res.json();
}

// --- FUNGSI UNTUK MENUS ---
export async function getVtourMenus(): Promise<VtourMenu[]> {
  const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${laravelApiUrl}/api/vtour/menus`, { cache: 'no-store' });

  // ✅ Tambahkan pengecekan ini
  const contentType = res.headers.get("content-type");
  if (!res.ok || !contentType || !contentType.includes("application/json")) {
    const errorText = await res.text(); // Ambil response sebagai teks
    throw new Error(
      `Gagal memuat menu: Server merespon dengan non-JSON. Response: ${errorText.substring(0, 200)}...`
    );
  }

  const data = await res.json();
  return data.data;
}


export async function createVtourMenu(payload: Partial<VtourMenu>) {
  // Dipanggil dari client component (halaman admin)
  const res = await fetch(`${apiBase}/menus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal menambahkan menu");
  return res.json();
}

export async function updateVtourMenu(id: number, payload: Partial<VtourMenu>) {
  // Dipanggil dari client component
  const res = await fetch(`${apiBase}/menus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal mengubah menu");
  return res.json();
}

export async function deleteVtourMenu(id: number) {
  // Dipanggil dari client component
  const res = await fetch(`${apiBase}/menus/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal menghapus menu");
}

export async function saveMenuOrder(menus: { id: number; order: number }[]) {
  // Dipanggil dari client component
  const res = await fetch(`${apiBase}/menus/update-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menus }),
  });
  if (!res.ok) throw new Error("Gagal menyimpan urutan menu");
}