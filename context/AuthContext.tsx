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

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return tokenData.exp < currentTime;
    } catch {
      return true;
    }
  };

  // Check if stored token is expired based on timestamp
  const isStoredTokenExpired = (): boolean => {
    const tokenTimestamp = localStorage.getItem("vtourAdminTokenTimestamp");
    if (!tokenTimestamp) return true;
    
    const currentTime = Date.now();
    const storedTime = parseInt(tokenTimestamp);
    return currentTime - storedTime > TOKEN_EXPIRATION_TIME;
  };

  // Init: ambil token → set header → getProfile
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("vtourAdminToken");
        if (storedToken) {
          // Check if token is expired
          if (isTokenExpired(storedToken) || isStoredTokenExpired()) {
            console.log("Token expired, removing...");
            localStorage.removeItem("vtourAdminToken");
            localStorage.removeItem("vtourAdminTokenTimestamp");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
          }

          setToken(storedToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          const profile = await authAPI.getProfile();
          setUser(profile);
        }
      } catch (e) {
        console.log("Auth initialization failed, clearing tokens...");
        localStorage.removeItem("vtourAdminToken");
        localStorage.removeItem("vtourAdminTokenTimestamp");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Set up periodic token validation
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        await authAPI.getProfile();
      } catch (error) {
        console.log("Token validation failed, logging out...");
        await logout();
      }
    };

    // Validate token every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authAPI.login(username, password);
      const accessToken: string | undefined = payload?.token;
      const userFromLogin = payload?.user ?? null;

      if (!accessToken) return false;

      // Simpan token + timestamp + username + aktifkan header
      localStorage.setItem("vtourAdminToken", accessToken);
      localStorage.setItem("vtourAdminTokenTimestamp", Date.now().toString());
      localStorage.setItem("vtourAdminUsername", username); // Simpan username
      setToken(accessToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Opsional (disarankan): verifikasi token dengan getProfile
      try {
        const profile = await authAPI.getProfile();
        setUser(profile || userFromLogin);
      } catch {
        // Token tidak valid untuk /profile → gagal
        localStorage.removeItem("vtourAdminToken");
        localStorage.removeItem("vtourAdminTokenTimestamp");
        localStorage.removeItem("vtourAdminUsername");
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
      localStorage.removeItem("vtourAdminTokenTimestamp");
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
