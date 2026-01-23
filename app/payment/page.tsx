"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");
  const [paying, setPaying] = useState(false);

  const payNow = async (method: string) => {
    try {
      setPaying(true);

      const res = await fetch("/api/payment/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, method }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/success?orderId=${orderId}`);
      } else {
        alert("Payment failed. Try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Invalid order
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl animate-scale-in text-white">

        <h1 className="text-3xl font-bold mb-2 text-center">
          Complete Payment
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Order ID: {orderId}
        </p>

        <div className="space-y-4">

          <button
            onClick={() => payNow("CARD")}
            disabled={paying}
            className="w-full bg-white text-black py-3 rounded-xl font-medium hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Processing..." : "💳 Pay With Card"}
          </button>

          <button
            onClick={() => payNow("UPI")}
            disabled={paying}
            className="w-full bg-green-500 text-black py-3 rounded-xl font-medium hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Processing..." : "📱 Pay With UPI"}
          </button>

          <button
            onClick={() => payNow("COD")}
            disabled={paying}
            className="w-full border border-zinc-700 py-3 rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Processing..." : "🚚 Cash On Delivery"}
          </button>

        </div>

      </div>
    </div>
  );
}
