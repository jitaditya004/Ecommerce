import { use } from "react";
import ProductCard from "./ProductCard";
import { GetProductsResult } from "@/types/products";

type Props = {
  dataPromise: Promise<GetProductsResult>;
};

export default function ProductGridServer({ dataPromise }: Props) {

  const data = use(dataPromise);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {data.products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
        />
      ))}
    </div>
  );
}
