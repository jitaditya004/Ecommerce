"use client";

import { useEffect, useState } from "react";

type Product = {
  product_id: string;
  name: string;
  price: number;
  stock: number;
};

export default function AdminProducts() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    const res = await fetch("/api/admin/products", {
      credentials: "include",
    });

    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchProducts();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        Products
      </h1>

      <table className="border w-full">

        <thead>
          <tr className="border">
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.product_id} className="border">

              <td>{p.name}</td>
              <td>₹ {p.price}</td>
              <td>{p.stock}</td>

              <td>
                <button
                  onClick={() => deleteProduct(p.product_id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
