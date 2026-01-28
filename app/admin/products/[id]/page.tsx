"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setName(d.name);
        setPrice(d.price);
      });
  }, [id]);

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const form = new FormData();
    form.append("name", name);
    form.append("price", price);

    if (image) {
      form.append("image", image);
    }

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      body: form,
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err.message || "Update failed");
    }


    router.push("/admin/products");

  } catch (error) {
    console.error("Update failed:", error);
    alert("Update failed. Check console.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg">

      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        <input
          placeholder="Product Image"
          type="file"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>


      </form>

    </div>
  );
}
