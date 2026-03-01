"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apifetch } from "@/lib/apiFetch";

type ReportIssuePayload = {
  name: string;
  email: string;
  message: string;
};

const reportIssue = async (payload: ReportIssuePayload) => {
  const res = await apifetch("/report", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(res.message);
  }
};

export default function ReportIssuePage() {
  const [success, setSuccess] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: reportIssue,
    onSuccess: () => setSuccess(true),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    mutate({
      name: (form.elements.namedItem("user_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("user_email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    });

    form.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-zinc-950 to-zinc-900 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-zinc-900/70 backdrop-blur-md border border-zinc-800 shadow-2xl rounded-3xl p-8 space-y-6 transition-all"
      >
        <h1 className="text-3xl font-bold text-center tracking-tight">
          Report an Issue
        </h1>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl p-3 text-center">
            Issue submitted successfully.
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
            {(error as Error).message}
          </div>
        )}

        <div className="space-y-4">
          <input
            name="user_name"
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition"
          />

          <input
            name="user_email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition"
          />

          <textarea
            name="message"
            required
            rows={4}
            placeholder="Describe the issue..."
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl font-semibold bg-white text-black hover:scale-[1.02] active:scale-[0.98] transition disabled:bg-zinc-600 disabled:text-zinc-300"
        >
          {isPending ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}