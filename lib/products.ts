import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Product } from "@/types/product";

export type GetProductsResult = {
  products: Product[];
  total: number;
  error: boolean;
};

export async function getProductsFromDB(
  page: number,
  limit: number,
  sort: string
): Promise<GetProductsResult> {
  try {
    const skip = (page - 1) * limit;

    let orderBy: Prisma.productsOrderByWithRelationInput = {
      created_at: "desc",
    };

    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "name_asc") orderBy = { name: "asc" };
    if (sort === "reviews") {
      orderBy = { reviews: { _count: "desc" } };
    }

    const products = await prisma.products.findMany({
      where: { is_active: true },
      skip,
      take: limit,
      include: {
        reviews: { select: { rating: true } },
      },
      orderBy,
    });

    const total = await prisma.products.count({
      where: { is_active: true },
    });

    const formatted: Product[] = products.map((p) => {
      const avgRating =
        p.reviews.length === 0
          ? 0
          : p.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
            p.reviews.length;

      return {
        product_id: Number(p.product_id),
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        image_url: p.image_url,
        avgRating,
      };
    });

    return {
      products: formatted,
      total,
      error: false,
    };
  } catch {
    return {
      products: [],
      total: 0,
      error: true,
    };
  }
}