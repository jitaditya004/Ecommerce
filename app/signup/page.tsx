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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await apifetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Signup failed");
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 8500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 overflow-hidden">

      {loading && (
        <div className="fixed top-6 right-6 z-50 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 shadow-xl w-64 overflow-hidden">
          <p className="text-sm text-white mb-2">Creating account...</p>
          <div className="h-1 bg-zinc-700 rounded overflow-hidden">
            <div className="h-full bg-white animate-reverse-loader" />
          </div>
        </div>
      )}


      {success && (
        <div className="fixed left-0 top-0 h-full w-2 bg-green-500 animate-success-bar z-50" />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl animate-scale-in relative"
      >

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4 text-center">
            Signup successful ✓ Redirecting...
          </p>
        )}

        <div className="space-y-4">

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={success}
          />

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
          />

          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
          />

        </div>

        <button
          type="submit"
          disabled={success}
          className="w-full mt-6 bg-white text-black py-2.5 rounded-full font-medium hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {success ? "Success ✓" : "Sign up"}
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
