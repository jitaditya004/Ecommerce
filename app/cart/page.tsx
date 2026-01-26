"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { items, totalPrice, isLoading } = useCart();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Checking session...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Loading cart...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Please login to view your cart
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12 text-white">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Your Cart</h1>

          <p className="text-xl font-semibold text-green-400">
            Total: ₹ {totalPrice}
          </p>
        </div>

        <div className="space-y-5">

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:scale-[1.01] transition"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.products.name}
                </h3>

                <p className="text-zinc-400">
                  ₹ {item.products.price}
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
                  >
                    -
                  </button>

                  <span className="min-w-[24px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-500 hover:text-red-400 transition"
                  >
                    Remove
                  </button>

                </div>
              </div>

              <p className="font-semibold text-green-400">
                ₹ {item.products.price * item.quantity}
              </p>

            </div>
          ))}

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={handleCheckout}
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition"
          >
            Proceed To Checkout
          </button>

        </div>

      </div>

    </div>
  );
}

async function updateQty(id: number, delta: number) {
  await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, delta }),
  });

  mutate("/api/cart");
}

async function removeItem(id: number) {
  await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  mutate("/api/cart");
}

async function handleCheckout() {
  const res = await fetch("/api/order/create", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (data.orderId) {
    window.location.href = `/checkout?orderId=${data.orderId}`;
  }
}
