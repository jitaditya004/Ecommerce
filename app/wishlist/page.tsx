"use client";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="p-20 text-center text-zinc-400 animate-pulse">
        Loading wishlist...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-zinc-400">
        <p className="text-2xl mb-2">❤️</p>
        <p className="text-lg font-medium">Your wishlist is empty</p>
        <p className="text-sm">Start saving your favorite products</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 text-white">

      <h1 className="text-3xl font-bold mb-8">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {wishlist.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:scale-[1.02] transition-transform duration-300"
          >
            <div>
              <p className="font-semibold text-lg">
                {item.name}
              </p>

              <p className="mt-1 text-green-400 font-medium">
                ₹ {item.price}
              </p>
            </div>

            <button type="button"className="text-red-500 hover:scale-110 transition">
              ❌
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}
