import Link from "next/link";
import Image from "next/image";
import { apifetch } from "@/lib/apiFetch";

type Product = {
  product_id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
};

async function searchProducts(query: string): Promise<Product[]> {
  const res = await apifetch<Product[]>(
    `/products/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  return res.data;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {

  const q = (await searchParams).q || "";

  const products = await searchProducts(q);

  return (
    <div className="min-h-screen bg-black px-4 sm:px-10 py-10 text-white">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Search Results for &#34;{q}&#34;
        </h1>

        {products.length === 0 ? (
          <p className="text-zinc-400">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((product) => (

              <Link
                key={product.product_id}
                href={`/products/${product.slug}`}
                className="
                  bg-zinc-900 border border-zinc-800 rounded-2xl
                  overflow-hidden hover:border-zinc-600 transition
                "
              >

                <div className="relative h-64">

                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-4">

                  <h2 className="font-semibold text-lg">
                    {product.name}
                  </h2>

                  <p className="text-green-400 mt-2">
                    ₹ {product.price}
                  </p>

                </div>

              </Link>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}