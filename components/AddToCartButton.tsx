"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apifetch } from "@/lib/apiFetch";

type AddToCartResponse = {
  success: true;
};

type Props = {
  productId: number;
  disabled: boolean;
};

export default function AddToCartButton({
  productId,
  disabled,
}: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<null | "success" | "error">(null);

  const handleAdd = async () => {
    if (loading || disabled) return;

    try {
      setLoading(true);

      const res = await apifetch<AddToCartResponse>("/cart/add", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        setShowToast("error");
        throw new Error(res.message);
      }

      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      setShowToast("success");

      setTimeout(() => setShowToast(null), 1500);

    } catch (err) {
      console.error("Add to cart error:", err);
      setShowToast("error");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      {/* {showToast && (
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
      </button> */}

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
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            Adding…
          </>
        ) : showToast === "success" ? (
          <>
            <span>✓</span>
            Added
          </>
        ) : (
          "Add to Cart"
        )}
      </button>


    </div>
  );
}
