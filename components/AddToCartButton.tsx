"use client";

import { useCart } from "@/hooks/useCart";
import { useState } from "react";

type Props = {
  productId: number;
  disabled: boolean;
};

export default function AddToCartButton({
  productId,
  disabled,
}: Props) {
  const { mutate } = useCart();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<null | "success" | "error">(null);

  const handleAdd = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        setShowToast("error");
        return;
      }

      await mutate();
      setShowToast("success");

      setTimeout(() => setShowToast(null), 1500);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      {showToast && (
        <div
          className={`
            absolute -top-10 left-1/2 -translate-x-1/2
            px-4 py-1.5 rounded-full text-sm font-medium shadow-lg
            transition animate-fade-up
            ${showToast === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"}
          `}
        >
          {showToast === "success"
            ? "Added to cart ✓"
            : "Login required"}
        </div>
      )}

      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleAdd}
        className="
          w-full mt-3
          bg-white text-black
          py-2.5 rounded-lg font-medium
          transition-all
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

    </div>
  );
}
