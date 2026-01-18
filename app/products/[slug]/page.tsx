import { Product } from "@/types/product";

async function getProduct(slug: string) {
  const res = await fetch(
    `http://localhost:3000/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product: Product = await getProduct(params.slug);

  return (
    <div className="px-10 py-16 max-w-5xl mx-auto grid grid-cols-2 gap-12">

      {/* IMAGE */}
      <div className="bg-gray-100 h-96 rounded-xl" />

      {/* INFO */}
      <div>
        <h1 className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-600 mt-4">
          {product.description}
        </p>

        <p className="text-2xl font-semibold mt-6">
          ₹ {product.price}
        </p>

        <p className="mt-2">
          {product.stock > 0
            ? "In stock"
            : "Out of stock"}
        </p>

        <button
          disabled={product.stock === 0}
          className="mt-6 bg-black text-white px-8 py-3 rounded-lg disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}
