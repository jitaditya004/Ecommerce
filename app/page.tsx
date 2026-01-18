// import ProductGrid from "@/components/ProductGrid";
// import { Product } from "@/types/product";
import HomeClient from "@/components/HomeClient";
// import { Suspense } from "react";


export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache:"default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }


  // const products: Product[] = await res.json();

  return (
    <>
      <HomeClient />
      {/* <section className="px-10 pb-24">
       <h2 className="text-2xl font-semibold mb-8 text-gray-100">
          Featured Products
        </h2>
         <Suspense fallback={<p>Loading...</p>}>
          <ProductGrid products={products}/>
        </Suspense>
         
      </section> */}
    </>
  );
}
