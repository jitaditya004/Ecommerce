"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apifetch } from "@/lib/apiFetch";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await apifetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Signup failed");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl animate-scale-in"
      >

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="space-y-4">

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-white text-black py-2.5 rounded-full font-medium hover:scale-105 transition"
        >
          Sign up
        </button>

        <p className="text-center text-sm text-zinc-400 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-white cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}
