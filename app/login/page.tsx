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


const handleSubmit = async (e: React.FormEvent) => {
  setError("");

  e.preventDefault();
  if (submitting) return;

  setSubmitting(true);
  try {
    const user = await login(email, password);
    if ( user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }

  } catch {
    setError("Invalid credentials");
  } finally {
    setSubmitting(false);
    
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={submitting} className="w-full bg-black text-white py-2">
        Login
      </button>
    </form>
  );
}
