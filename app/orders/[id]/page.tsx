"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(r => r.json());

export default function OrderDetailsPage() {

  const params = useParams();
  const id = params?.id as string | undefined;

  const { data, isLoading } = useSWR(
    id ? `/api/order/${id}` : null,
    fetcher
  );

  if (isLoading) return <p className="p-20">Loading...</p>;

  if (!data) return <p className="p-20">Order not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-xl font-bold mb-4">
        Order #{data.id}
      </h1>

      <p>Status: {data.status}</p>
      <p>Payment: {data.payment_status}</p>

      <hr className="my-4" />

      {data.items.map((item: any) => (
        <div key={item.id} className="flex justify-between mb-3">
          <p>{item.product.name} × {item.quantity}</p>
          <p>₹ {item.price * item.quantity}</p>
        </div>
      ))}

      <hr className="my-4" />

      <h2 className="font-bold">
        Total: ₹ {data.total}
      </h2>

    </div>
  );
}
