"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apifetch } from "@/lib/apiFetch";

type Role = "USER" | "ADMIN";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type LoginResponse = {
  user: User;
};

type LogoutResponse = {
  success: true;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadSession = async () => {
      try {
        const res = await apifetch<{user : User}>("/auth/refresh",{
          method: "POST",
        });

        console.log("AuthProvider - refresh response:", res);

        if(res.ok){
          setUser(res.data.user);
        }

      } catch (err) {
        console.error("Failed to refresh session:", err);
      } finally{
        setLoading(false);
        console.log("AuthProvider - user:", user, "loading:", loading);
      }
    };

    loadSession();

  }, []);


  const login = async (email: string, password: string) => {

    const res = await apifetch<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    console.log("AuthProvider - login response:", res);

    if (!res.ok) {
      throw new Error(res.message);
    }

    setUser(res.data.user);
  };

 
  const logout = async () => {

    const res = await apifetch<LogoutResponse>(
      "/auth/logout",
      {
        method: "POST",
      }
    );
    console.log("AuthProvider - logout response:", res);

    if (!res.ok) {
      throw new Error(res.message);
    }

    setUser(null);
  };

  console.log("AuthProvider - rendering with user:", user, "loading:", loading);  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};
