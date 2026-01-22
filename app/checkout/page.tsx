"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isLoading } = useCart();
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/order/create", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.orderId) {
        router.push(`/payment?orderId=${data.orderId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="p-20">Loading...</p>;

  if (items.length === 0) {
    return <p className="p-20">Cart empty</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {items.map(item => (
        <div key={item.id} className="flex justify-between mb-3">
          <p>{item.products.name} × {item.quantity}</p>
          <p>₹ {item.products.price * item.quantity}</p>
        </div>
      ))}

      <hr className="my-4" />

      <div className="flex justify-between font-bold">
        <p>Total</p>
        <p>₹ {totalPrice}</p>
      </div>

      <button
        onClick={createOrder}
        disabled={loading}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Creating Order..." : "Proceed To Payment"}
      </button>
    </div>
  );
}
