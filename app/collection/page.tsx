import { Product } from "@/types/product";
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
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function CollectionPage({ searchParams }: any) {
  const { products, total } = await getProducts(searchParams);

  return (
    <div className="px-10 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Our Collection
      </h1>

      <Controls total={total} />

      <Suspense fallback={<p>Loading...</p>}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
