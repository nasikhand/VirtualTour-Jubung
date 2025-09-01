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

// Token expiration time in milliseconds (24 hours)
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT → cek expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return tokenData.exp < currentTime;
    } catch {
      return true;
    }
  };

  // Cek expired pakai timestamp localStorage
  const isStoredTokenExpired = (): boolean => {
    const tokenTimestamp = localStorage.getItem("vtourAdminTokenTimestamp");
    if (!tokenTimestamp) return true;

    const currentTime = Date.now();
    const storedTime = parseInt(tokenTimestamp);
    return currentTime - storedTime > TOKEN_EXPIRATION_TIME;
  };

  // Init → ambil token → cek expired → set header → getProfile
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("vtourAdminToken");
        if (storedToken) {
          if (isTokenExpired(storedToken) || isStoredTokenExpired()) {
            console.log("⏰ Token expired, removing...");
            localStorage.removeItem("vtourAdminToken");
            localStorage.removeItem("vtourAdminTokenTimestamp");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
          }

          // token valid → simpan
          setToken(storedToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

          try {
            const profile = await authAPI.getProfile();
            setUser(profile);
          } catch (err) {
            console.warn("⚠️ getProfile gagal, tapi token masih dipakai.");
            setUser(null); // token tetap dipakai, user sementara null
          }
        }
      } catch (err) {
        console.error("❌ Auth initialization error:", err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Periodic token validation → tiap 5 menit cek
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      if (isTokenExpired(token) || isStoredTokenExpired()) {
        console.log("⏰ Token expired on interval, logging out...");
        await logout();
        return;
      }

      try {
        await authAPI.getProfile();
      } catch (error) {
        console.warn("⚠️ Token validation API gagal (bukan logout otomatis).");
      }
    };

    const interval = setInterval(validateToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  // Login
  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authAPI.login(username, password);
      const accessToken: string | undefined = payload?.token;
      const userFromLogin = payload?.user ?? null;

      if (!accessToken) return false;

      // Simpan token + timestamp + username
      localStorage.setItem("vtourAdminToken", accessToken);
      localStorage.setItem("vtourAdminTokenTimestamp", Date.now().toString());
      localStorage.setItem("vtourAdminUsername", username);

      setToken(accessToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Ambil profile (fallback ke user dari login kalau gagal)
      try {
        const profile = await authAPI.getProfile();
        setUser(profile || userFromLogin);
      } catch {
        console.warn("⚠️ Tidak bisa ambil profile setelah login, pakai data login saja.");
        setUser(userFromLogin);
      }

      return true;
    } catch (err) {
      console.error("❌ Login failed in context:", err);
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      console.warn("⚠️ Logout API gagal, tapi tetap hapus token.");
    } finally {
      localStorage.removeItem("vtourAdminToken");
      localStorage.removeItem("vtourAdminTokenTimestamp");
      localStorage.removeItem("vtourAdminUsername");
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
