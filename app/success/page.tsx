"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apifetch } from "@/lib/apiFetch";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const [error, setError] = useState("");

  useEffect(() => {

    if (!orderId) {
      router.replace("/");
      return;
    }

    let cancelled = false;  
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    const verifyOrder = async () => {

      attempts++;

      if (attempts > MAX_ATTEMPTS) {

        if (!cancelled) {

          setLoading(false);

          setError(
            "We are unable to verify your payment right now. If money was deducted, please contact support with your transaction reference."
          );
        }

        return;
      }

      try {

        const res = await apifetch<Order>(`/order/${orderId}`);

        if (!res.ok) {

          if (!cancelled) {
            setTimeout(verifyOrder, 2000);
          }

          return;
        }

        if (res.data.payment_status === "PAID") {

          if (!cancelled) {
            setOrder(res.data);
            setLoading(false);
          }

          return;
        }

        if (!cancelled) {
          setTimeout(verifyOrder, 2000);
        }

      } catch (err) {

        console.error(err);

        if (!cancelled) {
          setTimeout(verifyOrder, 2000);
        }

      }
    };

    verifyOrder();

    return () => {
      cancelled = true;
    };

  }, [orderId, router]);

  if (loading) {
    return (
      <LoadingSpinner text="Verifying payment..." />
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4">

        <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-8 text-center max-w-md w-full shadow-xl">

          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Verification Delayed
          </h1>

          <p className="text-zinc-300 mb-5 leading-relaxed">
            {error}
          </p>

          <div className="bg-zinc-800 rounded-xl p-3 text-sm text-zinc-400 mb-6">
            Transaction Reference:
            <span className="text-white ml-2 font-medium">
              {orderId}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => router.push("/orders")}
              className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:scale-105 transition"
            >
              View Orders
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="border border-zinc-700 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition"
            >
              Contact Support
            </button>

          </div>

        </div>

      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4">

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