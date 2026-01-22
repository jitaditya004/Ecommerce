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
        router.push("/success");
      } else {
        alert("Payment failed. Try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  if (!orderId) {
    return <p className="p-20">Invalid order</p>;
  }

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <p className="mb-4">Order ID: {orderId}</p>

      <button
        onClick={() => payNow("CARD")}
        disabled={paying}
        className="w-full bg-blue-600 text-white py-2 mb-3"
      >
        Pay With Card
      </button>

      <button
        onClick={() => payNow("UPI")}
        disabled={paying}
        className="w-full bg-green-600 text-white py-2 mb-3"
      >
        Pay With UPI
      </button>

      <button
        onClick={() => payNow("COD")}
        disabled={paying}
        className="w-full bg-gray-700 text-white py-2"
      >
        Cash On Delivery
      </button>
    </div>
  );
}
