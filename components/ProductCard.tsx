import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.image_url || "/placeholder.png";

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-4 transition hover:scale-[1.02] hover:shadow-xl">

      <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden">

        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.product_id} />
        </div>

        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          ⭐ {product.avgRating}
        </div>

      </div>

      <div className="mt-4 space-y-1">

        <h3 className="font-semibold text-white line-clamp-1">
          {product.name}
        </h3>

        <p className="text-green-400 font-semibold">
          ₹ {product.price}
        </p>

      </div>

      <div className="mt-4 space-y-2">

        <Link
          href={`/products/${product.slug}`}
          className="block text-center bg-white text-black py-2 rounded-lg font-medium hover:scale-105 transition"
        >
          View
        </Link>

        <AddToCartButton
          productId={product.product_id}
          disabled={product.stock === 0}
        />

      </div>

    </div>
  );
}
