"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type CartItem = {
  id: number;
  quantity: number;
  products: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function CartPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [fetching, setFetching] = useState(true);

const userId = user?.id;

useEffect(() => {
  if (!userId) return;

  let active = true;

  fetch("/api/cart", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (!active) return;

      setItems(data);
      setFetching(false);
    })
    .catch(() => {
      if (!active) return;
      setFetching(false);
    });

  return () => {
    active = false;
  };

}, [userId]);



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
                {item.products.name}
              </h3>

              <p>₹ {item.products.price}</p>

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
              ₹ {item.products.price * item.quantity}
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
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) {
  const res = await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, delta }),
  });

  const data = await res.json();
  console.log("CART RESPONSE:", data);
  

  if (Array.isArray(data)) {
    setItems(data);
  } else {
    setItems([]);
  }

}

async function removeItem(
  id: number,
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
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
