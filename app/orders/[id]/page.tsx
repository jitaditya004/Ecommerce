"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apifetch } from "@/lib/apiFetch";
interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url?: string | null;
  };
}

interface OrderDetails {
  id: number;
  status: string;
  payment_status: string;
  total: number;
  items: OrderItem[];
}

const fetchOrder = async (id: string): Promise<OrderDetails> => {
  const res = await apifetch<OrderDetails>(`/order/${id}`, {
  });

  if (!res.ok) {
    throw new Error(res.message);
  }

  return res.data;
};


export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

    const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Loading order...
      </div>
    );
  }

  if (!data||data.id===undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Order not found
      </div>
    );
  }

    if (isError || !data) {
      return (
        <div className="min-h-screen flex items-center justify-center text-zinc-400">
          Order not found
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-8 py-12 text-white">

      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl animate-scale-in">

        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">

          <h1 className="text-2xl font-bold">
            Order #{data.id}
          </h1>

          <div className="flex gap-3">

            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
              {data.status}
            </span>

            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
              {data.payment_status}
            </span>

          </div>

        </div>

        <div className="space-y-4 border-t border-zinc-800 pt-5">

          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-zinc-800/60 p-4 rounded-xl"
            >
              <div>
                <p className="font-medium">
                  {item.product.name}
                </p>

                <p className="text-sm text-zinc-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-green-400">
                ₹ {item.price * item.quantity}
              </p>

            </div>
          ))}

        </div>

        <div className="border-t border-zinc-800 mt-6 pt-5 flex justify-between items-center">

          <p className="text-lg font-medium">
            Total Amount
          </p>

          <p className="text-2xl font-bold text-green-400">
            ₹ {data.total}
          </p>

        </div>

      </div>

    </div>
  );
}
