"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { apifetch } from "@/lib/apiFetch";

type CreateOrderResponse = {
  orderId: string;
};


export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isLoading } = useCart();
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);

      const res = await apifetch<CreateOrderResponse>("/order/create", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(res.message);
      }

      if (res.data.orderId) {
        router.push(`/payment?orderId=${res.data.orderId}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
     finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12 text-white">

      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-scale-in">

        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        <div className="space-y-4">

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-zinc-800/60 p-4 rounded-xl"
            >
              <div>
                <p className="font-medium">
                  {item.products.name}
                </p>

                <p className="text-sm text-zinc-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-green-400">
                ₹ {item.products.price * item.quantity}
              </p>

            </div>
          ))}

        </div>

        <div className="border-t border-zinc-800 mt-6 pt-5 flex justify-between items-center">

          <p className="text-lg font-medium">
            Total
          </p>

          <p className="text-2xl font-bold text-green-400">
            ₹ {totalPrice}
          </p>

        </div>

        <button
          type="button"
          onClick={createOrder}
          disabled={loading}
          className="w-full mt-6 bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition disabled:opacity-60"
        >
          {loading ? "Creating Order..." : "Proceed To Payment"}
        </button>

      </div>

    </div>
  );
}
