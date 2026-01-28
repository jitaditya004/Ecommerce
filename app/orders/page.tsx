"use client";

import useSWR from "swr";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

interface OrdersResponse {
  orders: Order[];
}


const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

export default function OrdersPage() {
  const { data:ordersdata, isLoading } = useSWR<OrdersResponse>("/api/order", fetcher);
  const data = ordersdata?.orders;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 animate-pulse">
        Loading orders...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        No orders found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-8 py-12 text-white">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Orders
        </h1>

        <div className="space-y-5">

          {data.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex justify-between items-center flex-wrap gap-3">

                <p className="font-medium">
                  Order #{order.id}
                </p>



                <p className="text-green-400 font-semibold">
                  ₹ {order.total}
                </p>

                <p className="text-xs text-zinc-400">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </div>

              <div className="flex gap-3 mt-3 flex-wrap">

                <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
                  {order.status}
                </span>

                <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">
                  {order.payment_status}
                </span>

              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}
