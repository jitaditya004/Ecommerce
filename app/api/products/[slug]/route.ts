export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const {slug}= await context.params;
  const product = await prisma.products.findUnique({
    where: {
      slug,
    },
    select: {
      product_id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      image_url: true,
    },
  });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  const stats = await prisma.reviews.aggregate({
    where: {
      product_id: BigInt(product.product_id),
    },
    _avg: {
      rating: true,
    },
  });

  const formatProduct={
    ...product,
    product_id: Number(product.product_id),
    price: Number(product.price),
  }

  return NextResponse.json({
    formatProduct,
    avgRating: stats._avg.rating || 0
  });
}
