import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
        />
      ))}
    </div>
  );
}
