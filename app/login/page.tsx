"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);
    setShowLoader(true);

    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Invalid credentials");
      setShowLoader(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">

      {showLoader && (
        <div className="fixed top-5 right-5 z-50">

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 shadow-xl w-60 overflow-hidden">

            <p className="text-sm text-white font-medium">
              Logging in...
            </p>

            <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-reverse-progress" />

          </div>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md space-y-4 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          Login
        </h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg">
            {error}
          </p>
        )}

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
        />

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-white transition"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-white text-black py-2.5 rounded-full font-medium hover:scale-105 transition disabled:opacity-60"
        >
          {submitting ? "Please wait..." : "Login"}
        </button>

      </form>

    </div>
  );
}
