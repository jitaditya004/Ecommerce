"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) =>
  fetch(url).then(res => res.json());

export default function AdminProductsPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/products",
    fetcher
  );

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    mutate();
  };

  if (isLoading) {
    return <p className="text-zinc-400">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400">Failed to load products</p>;
  }

  if (!data || !data.products || data.products.length === 0) {
    return <p className="text-zinc-400">No products found</p>;
  }

  return (
    <div>

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          href="/admin/products/new"
          className="bg-white text-black px-4 py-2 rounded-lg"
        >
          Add Product
        </Link>
      </div>

      <div className="space-y-4">

        {data.products.map((p: any) => (
          <div
            key={p.product_id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-zinc-400">₹ {p.price}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/products/${p.product_id}`}
                className="text-blue-400"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(p.product_id)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
