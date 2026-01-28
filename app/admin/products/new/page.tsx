"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("price", price);
      if (image) form.append("image", image);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create product");
        setLoading(false);
        return;
      }

      router.push("/admin/products");

    } catch (err) {
      console.error(err);
      setError("Network error");
    }

    setLoading(false);
  };


  return (
    <div className="max-w-lg">

      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      {error && (
        <p className="bg-red-500/10 text-red-400 p-2 rounded text-sm">
          {error}
        </p>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Name"
          className="w-full bg-zinc-800 p-2 rounded"
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          className="w-full bg-zinc-800 p-2 rounded"
          onChange={e => setPrice(e.target.value)}
        />

        <input
          placeholder="Image"
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Create"}
        </button>


      </form>

    </div>
  );
}
