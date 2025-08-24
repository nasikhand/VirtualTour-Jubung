// File: context/AuthContext.tsx (Untuk Virtual Tour)
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, authAPI } from '@/lib/api-client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('vtourAdminToken');
      if (storedToken) {
        try {
          // Set token untuk API client
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await authAPI.getProfile();
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(username, password);
      
      // Handle different response structures
      let accessToken, userData;
      
      if (response.data) {
        // Response has data property
        accessToken = response.data.token;
        userData = response.data.user;
      } else if (response.token) {
        // Response is direct
        accessToken = response.token;
        userData = response.user;
      } else {
        console.error('Invalid response structure:', response);
        return false;
      }
      
      if (!accessToken) {
        console.error('No token received from server');
        return false;
      }
      
      localStorage.setItem('vtourAdminToken', accessToken);
      setToken(accessToken);
      setUser(userData);
      
      // Set token untuk API client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('vtourAdminToken');
      setToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      window.location.href = '/admin/sign-in';
    }
  };

  const value = {
    isAuthenticated: !!token,
    isLoading,
    user,
    token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};