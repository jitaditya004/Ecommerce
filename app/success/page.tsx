"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {

  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful ✅
        </h1>

        <p className="mb-2">
          Your order has been placed successfully.
        </p>

        {orderId && (
          <p className="font-semibold mb-4">
            Order ID: {orderId}
          </p>
        )}

        <div className="flex gap-4 justify-center mt-6">

          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            View Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="border px-4 py-2 rounded"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}
