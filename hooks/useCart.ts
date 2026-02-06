import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { apifetch } from "@/lib/apiFetch";

type Product = {
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
};

type CartItem = {
  id: number;
  quantity: number;
  products: Product;
};

type CartResponse = {
  items: CartItem[];
};

const fetchCart = async (): Promise<CartResponse> => {
  const res = await apifetch<CartResponse>("/cart");

  if (!res.ok) {
    throw new Error(res.message);
  }

  return res.data;
};

export function useCart() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: Boolean(user),
    staleTime: 30_000,
  });

  const items = data?.items ?? [];

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  return {
    items,
    count,
    totalPrice,
    isLoading,
    isError,
    error,
    refetch,
  };
}
