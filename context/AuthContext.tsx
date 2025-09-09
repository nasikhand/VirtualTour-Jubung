"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import apiClient, { authAPI } from "@/lib/api-client";

/* =========================
   Types
========================= */
type User =
  | { id?: number; username?: string; name?: string; [k: string]: any }
  | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* =========================
   Constants
========================= */
// 24 jam
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

/* =========================
   Safe utils
========================= */
function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

function decodeJwtPayload(token: string): any | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp < nowSec;
}

function isStoredTokenExpired(): boolean {
  try {
    const ts = localStorage.getItem("vtourAdminTokenTimestamp");
    if (!ts) return true;
    const stored = Number(ts);
    if (!Number.isFinite(stored)) return true;
    return Date.now() - stored > TOKEN_EXPIRATION_TIME;
  } catch {
    return true;
  }
}

function setAuthHeader(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

function clearStoredAuth() {
  localStorage.removeItem("vtourAdminToken");
  localStorage.removeItem("vtourAdminTokenTimestamp");
  localStorage.removeItem("vtourAdminUsername");
}

function setStoredAuth(token: string, username: string) {
  localStorage.setItem("vtourAdminToken", token);
  localStorage.setItem("vtourAdminTokenTimestamp", String(Date.now()));
  localStorage.setItem("vtourAdminUsername", username);
}

/* =========================
   Provider
========================= */
export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // simpan id interval agar pasti dibersihkan
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // inisialisasi dari localStorage (sekali saja)
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("vtourAdminToken");
        const storedUsername = localStorage.getItem("vtourAdminUsername");

        if (!storedToken || !storedUsername) {
          if (!cancelled) {
            setUser(null);
            setToken(null);
          }
          return;
        }

        // cek expiry (JWT dan timestamp lokal)
        if (isJwtExpired(storedToken) || isStoredTokenExpired()) {
          clearStoredAuth();
          if (!cancelled) {
            setUser(null);
            setToken(null);
          }
          return;
        }

        // set header + state token
        setAuthHeader(storedToken);
        if (!cancelled) setToken(storedToken);

        // ambil profil segar
        try {
          const profile = await authAPI.getProfile();
          if (!cancelled) setUser(profile ?? { username: storedUsername, name: storedUsername });
        } catch {
          // fallback bila endpoint profile gagal tapi token masih ada
          if (!cancelled) setUser({ username: storedUsername, name: storedUsername });
        }
      } catch (e) {
        // hard reset bila ada error tak terduga
        console.warn("Auth init error:", toError(e));
        clearStoredAuth();
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    if (!initialized) {
      initAuth();
    }

    return () => {
      cancelled = true;
    };
  }, [initialized]);

  // jaga header Authorization selalu sinkron dengan token
  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  // validasi token berkala (tiap 10 menit) + retry kecil
  useEffect(() => {
    // bersihkan interval lama bila ada
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!token) return;

    let retryCount = 0;
    const maxRetries = 2;

    const validateToken = async () => {
      try {
        await authAPI.getProfile();
        retryCount = 0; // reset jika sukses
      } catch (e) {
        retryCount += 1;
        console.warn(
          `Token validation failed (${retryCount}/${maxRetries}):`,
          toError(e)
        );
        if (retryCount >= maxRetries) {
          // token dianggap tidak valid lagi
          await logout(); // aman dipanggil di sini
        }
      }
    };

    intervalRef.current = setInterval(validateToken, 10 * 60 * 1000); // 10 menit
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // sengaja tidak memasukkan "logout" dalam deps untuk mencegah reinit interval tiap render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const payload = await authAPI.login(username, password);
      const accessToken: string | undefined = payload?.token;
      const userFromLogin = payload?.user ?? null;

      if (!accessToken) return false;

      // simpan & set token
      setStoredAuth(accessToken, username);
      setToken(accessToken);
      setAuthHeader(accessToken);

      // verifikasi (disarankan)
      try {
        const profile = await authAPI.getProfile();
        setUser(profile || userFromLogin || { username, name: username });
      } catch {
        // token ternyata tidak valid untuk /profile → gagal login
        clearStoredAuth();
        setUser(null);
        setToken(null);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Login failed in context:", toError(err));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout().catch(() => {});
    } finally {
      // bersihkan semua state & storage
      clearStoredAuth();
      setUser(null);
      setToken(null);
      setAuthHeader(null);

      // hentikan interval validasi jika ada
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // redirect ke halaman sign-in
      if (typeof window !== "undefined") {
        window.location.href = "/admin/sign-in";
      }
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, initialized, login, logout }),
    [user, token, loading, initialized, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================
   Hook
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
