"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { apifetch } from "@/lib/apiFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface WishlistItem {
  id: number;
  name?: string;
  price?: number;
  image_url?: string | null;
}


type ToggleWishlistResponse = {
  success: true;
}

export default function WishlistButton({
  productId,
}: {
  productId: number;
}) {
  const queryClient = useQueryClient();
  const { wishlist } = useWishlist();

  const isWishlisted = wishlist.some(
    (item) => item.id === productId
  );

  const { mutate,isPending } = useMutation({
    mutationFn: async () => {
      const res = await apifetch<ToggleWishlistResponse>("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        throw new Error(res.message);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previous= queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      queryClient.setQueryData<WishlistItem[]>(["wishlist"], (old=[]) => 
        isWishlisted
          ? old.filter((item) => item.id !== productId)
          : [...old, { id: productId } as WishlistItem]
      );

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<WishlistItem[]>(["wishlist"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });


  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => mutate()}
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
