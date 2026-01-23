import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";


export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.image_url || "/placeholder.png";

  return (
    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition">

      <div className="h-48 bg-gray-100 rounded-xl overflow-hidden relative">

        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
        />

      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mt-1">
        ₹{product.price}
      </p>

      <p className="text-gray-600 text-sm mt-1">
        Rating: {product.avgRating}
      </p>

      <Link className="mt-4 w-full bg-black text-white py-2 rounded-lg disabled:opacity-50" href={`/products/${product.slug}`}>
        View
      </Link>

      <AddToCartButton productId={product.product_id} disabled={product.stock === 0} />

      <WishlistButton productId={product.product_id} />

    </div>
  );
}


// const toggleWishlist = async () => {
//   await fetch("/api/wishlist/toggle", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ productId }),
//   });
// };
