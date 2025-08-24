import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VTOUR_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vtourAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vtourAdminToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await axios.post('/api/login/vtour-admin', {
      username,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/admin/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/admin/profile');
    return response.data;
  },
};

export const vtourAPI = {
  getScenes: async (page = 1) => {
    const response = await apiClient.get(`/vtour/scenes?page=${page}`);
    return response.data;
  },

  getScene: async (id: string | number) => {
    const response = await apiClient.get(`/vtour/scenes/${id}`);
    return response.data;
  },

  createScene: async (formData: FormData) => {
    const response = await apiClient.post('/vtour/scenes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateScene: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/vtour/scenes/${id}`, data);
    return response.data;
  },

  deleteScene: async (id: string | number) => {
    const response = await apiClient.delete(`/vtour/scenes/${id}`);
    return response.data;
  },

  getMenus: async () => {
    const response = await apiClient.get('/vtour/menus');
    return response.data;
  },

  createMenu: async (data: any) => {
    const response = await apiClient.post('/vtour/menus', data);
    return response.data;
  },

  updateMenu: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/vtour/menus/${id}`, data);
    return response.data;
  },

  deleteMenu: async (id: string | number) => {
    const response = await apiClient.delete(`/vtour/menus/${id}`);
    return response.data;
  },

  updateMenuOrder: async (orders: { id: number; order: number }[]) => {
    const response = await apiClient.put('/vtour/menus/update-order', { orders });
    return response.data;
  },

  getHotspots: async (sceneId: string | number) => {
    const response = await apiClient.get(`/vtour/scenes/${sceneId}/hotspots`);
    return response.data;
  },

  createHotspot: async (data: any) => {
    const response = await apiClient.post('/vtour/hotspots', data);
    return response.data;
  },

  updateHotspot: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/vtour/hotspots/${id}`, data);
    return response.data;
  },

  deleteHotspot: async (id: string | number) => {
    const response = await apiClient.delete(`/vtour/hotspots/${id}`);
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get('/vtour/settings');
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await apiClient.put('/vtour/settings', data);
    return response.data;
  },

  uploadLogo: async (formData: FormData) => {
    const response = await apiClient.post('/vtour/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export { apiClient };
