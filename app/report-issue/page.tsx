"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ReportIssuePage() {

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        e.currentTarget,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSuccess(true);
      e.currentTarget.reset();

    } catch (err) {
      console.error(err);
      setError("Failed to send message. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4 text-white">

      <form
        onSubmit={sendEmail}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl"
      >

        <h1 className="text-2xl font-bold text-center">
          Report an Issue
        </h1>

        {success && (
          <p className="text-green-400 text-sm text-center">
            ✅ Message sent successfully
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <input
          name="user_name"
          placeholder="Your Name"
          className="w-full bg-zinc-800 p-2 rounded-lg"
          required
        />

        <input
          name="user_email"
          type="email"
          placeholder="Your Email"
          className="w-full bg-zinc-800 p-2 rounded-lg"
          required
        />

        <textarea
          name="message"
          placeholder="Describe your issue..."
          className="w-full bg-zinc-800 p-2 rounded-lg h-28"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded-full font-medium hover:scale-105 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit"}
        </button>

      </form>

    </div>
  );
}
