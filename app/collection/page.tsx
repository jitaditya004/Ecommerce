import { Product } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import { Suspense } from "react";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function CollectionPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="px-10 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Our Collection
      </h1>
       <Suspense fallback={<p>Loading...</p>}> 
            <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
