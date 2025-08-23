import { review } from "@/types";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && token !== 'dummy-admin-token') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

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

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/login/admin', {
      username,
      password
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/admin/update-profile', data);
    return response.data;
  },
  
  validateToken: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return { valid: false };
      }
      
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        return { valid: true, user: userData };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
};

export { apiClient };
