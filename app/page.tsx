import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/product";
import HomeClient from "@/components/HomeClient";


export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const products: Product[] = await res.json();

  return (
    <>
      <HomeClient />
      <section className="px-10 pb-24">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">
          Featured Products
        </h2>

        <ProductGrid products={products}/>
      </section>
    </>
  );
}
