"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: "PATIENT" | "DOCTOR";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "PATIENT" | "DOCTOR"
  ) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "https://appointment-system-user-service.vercel.app/api/auth/me",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://appointment-system-user-service.vercel.app/api/auth/login",
        { email: email.toLowerCase(), password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return res.data.user;
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "PATIENT" | "DOCTOR"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://appointment-system-user-service.vercel.app/api/auth/register",
        { name, email: email.toLowerCase(), password, role },
        { withCredentials: true }
      );
      return res.data;
    } catch (err: any) {
      console.log(err.response?.data?.error + "Error");
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://appointment-system-user-service.vercel.app/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } finally {
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
