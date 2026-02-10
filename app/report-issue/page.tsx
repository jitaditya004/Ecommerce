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
      name: form.user_name.value,
      email: form.user_email.value,
      message: form.message.value,
    });

    form.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={submit}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Report an Issue</h1>

        {success && (
          <p className="text-green-400 text-center">
            Issue submitted successfully
          </p>
        )}

        {error && (
          <p className="text-red-400 text-center">
            {(error as Error).message}
          </p>
        )}

        <input name="user_name" required placeholder="Your Name" />
        <input name="user_email" required type="email" placeholder="Email" />
        <textarea name="message" required placeholder="Describe issue" />

        <button disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
