"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart} from "@/hooks/useCart";
import { mutate } from "swr";


export default function CartPage() {
  const { user, loading } = useAuth();
  const { items, totalPrice, isLoading } = useCart();

  

  if (loading) {
    return <p className="p-20">Checking session...</p>;
  }


  if (isLoading) {
    return <p className="p-20">Loading cart...</p>;
  }


  if (!user) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-semibold">
          Please login to view your cart
        </h2>
      </div>
    );
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
      <h2 className="text-xl font-semibold mb-4">
        Total: ₹ {totalPrice}
      </h2>


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
                  type="button"
                  onClick={() => updateQty(item.id, -1)}
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => updateQty(item.id, 1)}
                  className="px-2 border"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
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

      {/* <button
        type="button"
        onClick={handleCheckout}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        Proceed To Checkout
      </button> */}

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

  mutate("/api/cart"); // re-fetch cart
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


// const handleCheckout = async () => {
//   const res = await fetch("/api/order/create", {
//     method: "POST",
//     credentials: "include",
//   });

//   const data = await res.json();

//   if (data.orderId) {
//     window.location.href = `/payment?orderId=${data.orderId}`;
//   }
// };
