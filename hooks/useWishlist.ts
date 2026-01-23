import useSWR from "swr";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(r => r.json());

export function useWishlist() {

  const { data, isLoading, mutate } = useSWR<WishlistItem[]>(
    "/api/wishlist",
    fetcher
  );

  return {
    wishlist: data ?? [],
    isLoading,
    mutate,
  };
}
