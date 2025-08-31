"use client";

import axios, { AxiosError } from "axios";
import type { Scene } from "@/types/virtual-tour";


/** Base URL dari environment variable */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Catatan:
 * - Karena baseURL SUDAH di /api, JANGAN pakai path yang diawali /api lagi.
 * - Gunakan path seperti "/login/..." atau "/vtour/..." (tanpa /api).
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 15000,
});

// Sisipkan Authorization Bearer dari localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vtourAdminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(
      "[REQ]",
      config.method?.toUpperCase(),
      (config.baseURL || "") + (config.url || ""),
      {
        headers: {
          Authorization: config.headers.Authorization ? "Bearer ***" : undefined,
        },
        params: config.params,
        data: config.data,
      }
    );
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[RES]", res.status, res.config.url, res.data);
    }
    return res;
  },
  (err: AxiosError<any>) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug(
        "[ERR]",
        err.config?.baseURL + (err.config?.url || ""),
        err.response?.status,
        err.response?.data || err.message
      );
    }
    return Promise.reject(err);
  }
);

const getAxiosMessage = (err: unknown) => {
  const ax = err as AxiosError<any>;
  return ax.response?.data?.message || ax.message || "Request error";
};

// ----------------- AUTH API -----------------
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      // BASE SUDAH /api → path TANPA /api
      const { data } = await apiClient.post("api/login/vtour-admin", {
        username,
        password,
      });

      const payload = (data && (data as any).data) ? (data as any).data : data;

      const token: string | null =
        payload?.token ??
        payload?.access_token ??
        payload?.accessToken ??
        null;

      const user =
        payload?.user ??
        payload?.admin ??
        payload?.data?.user ??
        null;

      if (!token) {
        // eslint-disable-next-line no-console
        console.error("Login response missing token. Raw payload:", payload);
        throw new Error("Login response did not contain a token");
      }
      return { token, user };
    } catch (err) {
      throw new Error(getAxiosMessage(err));
    }
  },

  getProfile: async () => {
    try {
      const { data } = await apiClient.get("api/login/vtour-admin/profile");
      const payload = (data && (data as any).data) ? (data as any).data : data;
      return payload?.user ?? payload?.admin ?? payload;
    } catch (err) {
      throw new Error(getAxiosMessage(err));
    }
  },

  logout: async () => {
    try {
      const { data } = await apiClient.post("api//login/vtour-admin/logout");
      return data;
    } catch (err) {
      throw new Error(getAxiosMessage(err));
    }
  },
};

// ----------------- VTOUR API -----------------
export const vtourAPI = {
  getScenes: async (page = 1) => {
    const res = await apiClient.get(`api//vtour/scenes`, { params: { page } });
    return res.data;
  },
  getScene: async (id: string | number): Promise<Scene | null> => {
  const res = await apiClient.get(`/api/vtour/scenes/${id}`);
  // backend kadang kirim { data: {...} } atau langsung {...}
  const payload =
    (res.data && typeof res.data === "object" && "data" in res.data)
      ? (res.data as any).data
      : res.data;
  return (payload ?? null) as Scene | null;
},
  createScene: async (formData: FormData) => {
    const res = await apiClient.post("/api/vtour/scenes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  updateScene: async (id: string | number, data: any) => {
    const res = await apiClient.put(`/api/vtour/scenes/${id}`, data);
    return res.data;
  },
  deleteScene: async (id: string | number) => {
    const res = await apiClient.delete(`/vtour/scenes/${id}`);
    return res.data;
  },

  getMenus: async () => {
    const res = await apiClient.get("/api/vtour/menus");
    return res.data;
  },
  createMenu: async (data: any) => {
    const res = await apiClient.post("/api/vtour/menus", data);
    return res.data;
  },
  updateMenu: async (id: string | number, data: any) => {
    const res = await apiClient.put(`/api/vtour/menus/${id}`, data);
    return res.data;
  },
  deleteMenu: async (id: string | number) => {
    const res = await apiClient.delete(`/api/vtour/menus/${id}`);
    return res.data;
  },

  getHotspots: async (sceneId: string | number) => {
    const res = await apiClient.get(`/api/vtour/scenes/${sceneId}/hotspots`);
    return res.data;
  },
  createHotspot: async (sceneId: string | number, data: any) => {
    const res = await apiClient.post(`/api/vtour/scenes/${sceneId}/hotspots`, data);
    return res.data;
  },
  updateHotspot: async (sceneId: string | number, hotspotId: string | number, data: any) => {
    const res = await apiClient.put(`/api/vtour/scenes/${sceneId}/hotspots/${hotspotId}`, data);
    return res.data;
  },
  deleteHotspot: async (sceneId: string | number, hotspotId: string | number) => {
    const res = await apiClient.delete(`/api/vtour/scenes/${sceneId}/hotspots/${hotspotId}`);
    return res.data;
  },
};

export default apiClient;
export async function getScene(id: string | number): Promise<Scene | null> {
  return vtourAPI.getScene(id);
}
