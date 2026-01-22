import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";

type Product = {
  name: string;
  price: number;
  image_url: string | null;
};

type CartItem = {
  id: number;
  quantity: number;
  products: Product;
};

type CartResponse = {
  items: CartItem[];
};

const fetcher = async (url: string): Promise<CartResponse> => {
  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
};

export function useCart() {
  const { user } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<CartResponse>(
    user ? "/api/cart" : null,
    fetcher
  );

  const items = data?.items ?? [];

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  return {
    items,
    count,
    totalPrice,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
