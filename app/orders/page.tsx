"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(r => r.json());

export default function OrdersPage() {

  const { data, isLoading } = useSWR("/api/order", fetcher);

  if (isLoading) return <p className="p-20">Loading orders...</p>;

  if (!data || data.length === 0) {
    return <p className="p-20">No orders found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {data.map((order: any) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block border p-4 mb-4 rounded"
        >
          <div className="flex justify-between">
            <p>Order #{order.id}</p>
            <p>₹ {order.total}</p>
          </div>

          <div className="text-sm text-gray-600">
            {order.status} • {order.payment_status}
          </div>
        </Link>
      ))}

    </div>
  );
}
