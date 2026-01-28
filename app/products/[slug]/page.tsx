
import AddToCartButton from "@/components/AddToCartButton";
import ReviewsSection from "@/components/ReviewsSection";
import WishlistButton from "@/components/WishlistButton";
import { apifetch } from "@/lib/apiFetch";
import Image from "next/image";
import { Product } from "@/types/product";

type ProductPageResponse = {
  formatProduct: Product;
  avgRating: number;
};


async function getProduct(slug: string): Promise<ProductPageResponse> {
  const res = await apifetch<ProductPageResponse>(
    `/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error(`Failed to fetch product: ${res.status} - ${res.message}`);
    throw new Error("Failed to fetch product data");
  }

  return res.data;
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { formatProduct: product, avgRating } = await getProduct(
    (await params).slug
  );

    const imageSrc = product.image_url || "/placeholder.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4 sm:px-10 py-12">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* IMAGE SECTION */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl h-[320px] sm:h-[420px] flex items-center justify-center overflow-hidden group">

          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

          <div className="text-zinc-500">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500" />

        </div>

        {/* INFO SECTION */}
        <div className="text-white space-y-5">

          <div className="flex justify-between items-start">

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            <WishlistButton productId={product.product_id} />
          </div>

          <p className="text-zinc-400 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-6 flex-wrap">

            <p className="text-3xl font-semibold text-green-400">
              ₹ {product.price}
            </p>

            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
              ⭐ {avgRating.toFixed(2)}
            </span>

          </div>

          <p
            className={`text-sm font-medium ${
              product.stock > 0
                ? "text-green-400"
                : "text-red-500"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="pt-4">

            <AddToCartButton
              productId={product.product_id}
              disabled={product.stock === 0}
            />

          </div>

          <div className="pt-8 border-t border-zinc-800">

            <ReviewsSection productId={product.product_id} />

          </div>

        </div>

      </div>

    </div>
  );
}
