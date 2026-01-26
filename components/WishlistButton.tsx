"use client";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({
  productId,
}: {
  productId: number;
}) {
  const { wishlist, mutate } = useWishlist();

  const isWishlisted = wishlist.some(
    (item) => item.id === productId
  );

  const toggleWishlist = async () => {
    mutate(
      (prev) =>
        isWishlisted
          ? prev?.filter((p) => p.id !== productId)
          : [...(prev || []), { id: productId } as any],
      false
    );

    await fetch("/api/wishlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    mutate();
  };

  return (
    <button
      onClick={toggleWishlist}
      aria-label="Toggle Wishlist"
      className={`
        w-9 h-9 flex items-center justify-center rounded-full
        bg-black/60 backdrop-blur border border-white/10
        transition transform active:scale-90
        ${isWishlisted ? "text-red-500 scale-110 animate-pulse" : "text-white hover:scale-110"}
      `}
    >
      {isWishlisted ? "❤️" : "🤍"}
    </button>
  );
}
