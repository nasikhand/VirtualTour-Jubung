"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { authAPI } from "@/lib/api-client";

type User = { id: number; username: string; name: string; [k: string]: any } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Init: ambil token → set header → getProfile
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("vtourAdminToken");
        if (storedToken) {
          setToken(storedToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          const profile = await authAPI.getProfile();
          setUser(profile);
        }
      } catch (e) {
        localStorage.removeItem("vtourAdminToken");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authAPI.login(username, password);
      const accessToken: string | undefined = payload?.token;
      const userFromLogin = payload?.user ?? null;

      if (!accessToken) return false;

      // Simpan token + aktifkan header
      localStorage.setItem("vtourAdminToken", accessToken);
      setToken(accessToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Opsional (disarankan): verifikasi token dengan getProfile
      try {
        const profile = await authAPI.getProfile();
        setUser(profile || userFromLogin);
      } catch {
        // Token tidak valid untuk /profile → gagal
        localStorage.removeItem("vtourAdminToken");
        setUser(null);
        setToken(null);
        return false;
      }

      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login failed in context:", err);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {}
    finally {
      localStorage.removeItem("vtourAdminToken");
      setUser(null);
      setToken(null);
      window.location.href = "/admin/sign-in";
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
