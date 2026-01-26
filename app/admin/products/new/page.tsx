"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    if (image) form.append("image", image);

    await fetch("/api/admin/products", {
      method: "POST",
      body: form,
    });

    router.push("/admin/products");
  };

  return (
    <div className="max-w-lg">

      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

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
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />

        <button className="bg-white text-black px-4 py-2 rounded">
          Create
        </button>

      </form>

    </div>
  );
}
