"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { apifetch } from "@/lib/apiFetch";

interface AdminProduct {
  product_id: string;
  name: string;
  price: number;
};

type AdminProductsResponse = {
  products: AdminProduct[];
};

const fetchProducts = async (): Promise<AdminProductsResponse> => {
  const res = await apifetch<AdminProductsResponse>("/admin/products");

  if (!res.ok) {
    throw new Error(res.message);
  }

  return res.data;
};

const deleteProduct = async (id: string): Promise<void> => {
  const res = await apifetch<{ success: true }>(
    `/admin/products/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    throw new Error(res.message);
  }
};

export default function AdminProductsPage() {

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const { mutate: removeProduct, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  if (isLoading) {
    return <p className="text-zinc-400">Loading...</p>;
  }

  if (isError || !data || data.products.length === 0) {
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

        {data.products.map((p) => (
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
                disabled={isPending}
                onClick={() => removeProduct(p.product_id)}
                className="text-red-400 disabled:opacity-60"
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
