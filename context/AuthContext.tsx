"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apifetch } from "@/lib/apiFetch";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient=useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadSession = async () => {
      try {
        const res = await apifetch<{user : User}>("/auth/refresh",{
          method: "POST",
        });


        if(res.ok){
          setUser(res.data.user);
        }

      } catch (err) {
        console.error("Failed to refresh session:", err);
      } finally{
        setLoading(false);
        
      }
    };

    loadSession();

  }, []);


  const login = async (email: string, password: string) => {
    queryClient.clear();

    const res = await apifetch<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

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
    

    if (!res.ok) {
      throw new Error(res.message);
    }

    await queryClient.cancelQueries();
    queryClient.clear();
    queryClient.removeQueries();

    setUser(null);

    window.location.href = "/";
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
