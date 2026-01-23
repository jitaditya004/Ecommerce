"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center max-w-md w-full shadow-xl animate-scale-in">

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-500/20 rounded-full blur-2xl" />

        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Payment Successful
        </h1>

        <p className="text-zinc-400 mb-3">
          Your order has been placed successfully.
        </p>

        {orderId && (
          <p className="bg-zinc-800 rounded-lg py-2 px-4 text-sm mb-5">
            Order ID: <span className="text-white font-medium">{orderId}</span>
          </p>
        )}

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
