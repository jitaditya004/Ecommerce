import ProductGrid from "@/components/ProductGrid";
import Controls from "@/components/Controls";
import { Suspense } from "react";

async function getProducts(searchParams: Promise<any>) {
  const page = (await searchParams).page ?? "1";
  const limit = (await searchParams).limit ?? "12";
  const sort = (await searchParams).sort ?? "recent";

  const res = await fetch(
    `http://localhost:3000/api/products?page=${page}&limit=${limit}&sort=${sort}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      products: [],
      total: 0,
      error: true,
    };
  }

  const data = await res.json();

  return {
    ...data,
    error: false,
  };
}


export default async function CollectionPage({ searchParams }: any) {
  const { products, total,error } = await getProducts(searchParams);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-zinc-400">
            Failed to load products. Please try again.
          </p>
          <a
            href="/collection"
            className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition"
          >
            Retry
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12 text-white">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <h1 className="text-3xl sm:text-4xl font-bold">
            Our Collection
          </h1>

          <Controls total={total} />

        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-64"
                />
              ))}
            </div>
          }
        >
          <ProductGrid products={products} />
        </Suspense>

      </div>

    </div>
  );
}
