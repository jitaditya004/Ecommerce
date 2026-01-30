import { useQuery } from "@tanstack/react-query";
import { apifetch } from "@/lib/apiFetch";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

type WishlistResponse = {
  items: WishlistItem[];
}

const fetchWishlist = async (): Promise<WishlistItem[]> => {
  const res = await apifetch<WishlistResponse>("/wishlist");

  if(!res.ok) {
    throw new Error(res.message);
  }
  return res.data.items ?? [];
};

export function useWishlist() {

  const {data , isLoading ,isError, error, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    wishlist: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
