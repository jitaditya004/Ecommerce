"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  console.log("AdminPage - user:", user, "loading:", loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center shadow-xl animate-scale-in">

        <div className="inline-block bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm mb-4">
          ADMIN PANEL
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Admin
        </h1>

        <p className="text-zinc-400">
          Manage products, orders and users from here.
        </p>

      </div>

    </div>
  );
}
