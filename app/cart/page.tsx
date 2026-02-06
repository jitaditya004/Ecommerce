"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apifetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import {useState} from "react";
import { InsufficientStockErrorResponse } from "@/types/errors";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { items, isLoading, totalPrice } = useCart();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [stockErrors, setStockErrors] = useState<
    { productId: number; available: number; requested: number }[]
  >([]);


  const updateQtyMutation = useMutation({
    mutationFn: async ({
      id,
      delta,
    }: {
      id: number;
      delta: number;
    }) => {

      const res = await apifetch("/cart/update", {
        method: "POST",
        body: JSON.stringify({ id, delta }),
      });

      if (!res.ok) {
        throw new Error(res.message);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    }
  });

  // ---------- Remove item ----------
  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {

      const res = await apifetch("/cart/remove", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(res.message);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  
  const checkoutMutation = useMutation<{orderId: number},InsufficientStockErrorResponse>({
    mutationFn: async () => {

      const res = await apifetch<{ orderId: number }>("/order/create", {
        method: "POST",
      });

      console.log(res);

      if (!res.ok) {
        throw res.data;
      }

      return res.data;
    },

    onSuccess: (data) => {
      router.push(`/checkout?orderId=${data.orderId}`);
    },
    onError: (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "INSUFFICIENT_STOCK"
      ) {
        const e = error as InsufficientStockErrorResponse;
        setStockErrors(e.items);
      }
    }

  });

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
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12 text-white">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Your Cart</h1>

          <p className="text-xl font-semibold text-green-400">
            Total: ₹ {totalPrice}
          </p>
        </div>

        <div className="space-y-5">

          {items.map((item) => {
            const error = stockErrors.find(
              e => e.productId === item.products.product_id
            );

            return(
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

                {error && (
                  <p className="text-red-400 text-sm mt-1">
                    Only {error.available} left. You selected {error.requested}.
                  </p>
                )}

                <div className="flex items-center gap-3 mt-3">

                  {item.quantity >= item.products.stock && (
                    <p className="text-red-500 text-sm">
                      Max stock reached
                    </p>
                  )}


                  <button
                    type="button"
                    onClick={() => updateQtyMutation.mutate({ id: item.id, delta: -1 })}
                    className="w-8 h-8 rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
                  >
                    -
                  </button>

                  <span className="min-w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    disabled={item.quantity>=item.products.stock}
                    onClick={() => updateQtyMutation.mutate({ id: item.id, delta: 1 })}
                    className="w-8 h-8 rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItemMutation.mutate(item.id)}
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
            );}
          )}
        

        </div>

        <div className="mt-8 flex justify-end">

          <button
            type="button"
            disabled={stockErrors.length>0}
            onClick={() => checkoutMutation.mutate()}
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition"
          >
            Proceed To Checkout
          </button>

        </div>

      </div>

    </div>
  );
}
