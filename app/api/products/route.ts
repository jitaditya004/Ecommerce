export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const sort = searchParams.get("sort") ?? "recent";

  const skip = (page - 1) * limit;

  let orderBy: any = { created_at: "desc" };

  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };
  if (sort === "reviews") orderBy = { reviews_count: "desc" };

  const products = await prisma.products.findMany({
    where: {
      is_active: true,
    },
    skip,
    take: limit,
    select: {
      product_id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image_url: true,
      reviews:{
        select:{
          rating:true,
        }
      }
    },
    orderBy,

  });

  const total = await prisma.products.count({
    where: {
      is_active: true,
    },
  });

  const formatted = products.map((p) => {
    const avgRating =
      p.reviews.length === 0
        ? 0
        : p.reviews.reduce((sum, r) => sum + (r.rating ?? 0) , 0) / p.reviews.length;

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


  return NextResponse.json({
    products: formatted,
    total,
    page,
    limit,

  });
}

