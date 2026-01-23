"use client";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({
  productId,
}: {
  productId: number;
}) {

  const { wishlist, mutate } = useWishlist();

  const isWishlisted = wishlist.some(
    item => item.id === productId
  );

  const toggleWishlist = async () => {

    mutate(
      prev =>
        isWishlisted
          ? prev?.filter(p => p.id !== productId)
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
      className="text-xl"
      aria-label="Toggle Wishlist"
    >
      {isWishlisted ? "❤️" : "🤍"}
    </button>
  );
}
