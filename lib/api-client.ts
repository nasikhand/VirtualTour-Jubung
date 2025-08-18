import { review } from "@/types";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Ambil review dari backend.
 * - Jika tanpa parameter: hanya review `approved` (untuk user)
 * - Jika `isAdmin: true`: ambil semua review (admin), bisa difilter pakai status
 */
export async function fetchReviews(
  options?: { isAdmin?: boolean; status?: 'pending' | 'approved' | 'rejected' }
): Promise<review[]> {
  try {
    let url = '';

    if (options?.isAdmin) {
      // Untuk halaman admin
      const query = options.status ? `?status=${options.status}` : '';
      url = `${API_BASE_URL}/admin/review${query}`;
    } else {
      // Untuk user (hanya approved)
      url = `${API_BASE_URL}/review/approved`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil review: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.data ?? result; // kalau pakai pagination, ambil `data`
  } catch (error) {
    console.error("Kesalahan saat mengambil review:", error);
    throw error;
  }
}

/**
 * Kirim review baru dari user
 */
export async function addReview(newReview: Omit<review, 'id' | 'icon'>): Promise<review> {
  try {
    const response = await fetch(`${API_BASE_URL}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal menambahkan review: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Kesalahan saat menambahkan review:", error);
    throw error;
  }
}

/**
 * Ubah status review (ACC atau Tolak)
 */
export async function updateReviewStatus(id: number, status: 'approved' | 'rejected'): Promise<review> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/review/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengupdate status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Kesalahan saat update status review:", error);
    throw error;
  }
}
