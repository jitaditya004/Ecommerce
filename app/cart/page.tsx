"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function CartPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    fetch("/api/cart", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setFetching(false);
      });
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-semibold">
          Please login to view your cart
        </h2>
      </div>
    );
  }

  if (fetching) {
    return <p className="p-20">Loading cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-semibold">
          Your cart is empty
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Your Cart
      </h1>

      <div className="space-y-6">

        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <h3 className="font-semibold">
                {item.product.name}
              </h3>

              <p>₹ {item.product.price}</p>

              <div className="flex items-center gap-3 mt-2">

                <button
                  onClick={() => updateQty(item.id, -1, setItems)}
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item.id, 1, setItems)}
                  className="px-2 border"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id, setItems)}
                  className="ml-4 text-red-600"
                >
                  Remove
                </button>

              </div>
            </div>

            <p className="font-semibold">
              ₹ {item.product.price * item.quantity}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

async function updateQty(
  id: number,
  delta: number,
  setItems: Function
) {
  const res = await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, delta }),
  });

  const data = await res.json();
  setItems(data);
}

async function removeItem(
  id: number,
  setItems: Function
) {
  const res = await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  setItems(data);
}
