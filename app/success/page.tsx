"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  payment_status: string;
};

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }

    const verifyOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);

        if (!res.ok) {
          router.replace("/");
          return;
        }

        const data = await res.json();

        if (data.payment_status !== "PAID") {
          router.replace("/");
          return;
        }

        setOrder(data);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    verifyOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Verifying payment...
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-md w-full shadow-xl">

        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Payment Successful
        </h1>

        <p className="text-zinc-400 mb-3">
          Your order has been placed successfully.
        </p>

        <p className="bg-zinc-800 rounded-lg py-2 px-4 text-sm mb-5">
          Order ID: <span className="text-white font-medium">{order.id}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">

          <button
            onClick={() => router.push("/orders")}
            className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:scale-105 transition"
          >
            View Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="border border-zinc-700 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}