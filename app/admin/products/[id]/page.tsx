"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setName(d.name);
        setPrice(d.price);
      });
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    if (image) form.append("image", image);

    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      body: form,
    });

    router.push("/admin/products");
  };

  return (
    <div className="max-w-lg">

      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        <input
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />

        <button className="bg-white text-black px-4 py-2 rounded">
          Update
        </button>

      </form>

    </div>
  );
}
