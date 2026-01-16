
import { Product } from "@/types/product";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
    
  return (
    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition">
      <div className="h-48 bg-gray-100 rounded-xl overflow-hidden relative">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mt-1">
        ₹{product.price}
      </p>

      <button
        className="mt-4 w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}
