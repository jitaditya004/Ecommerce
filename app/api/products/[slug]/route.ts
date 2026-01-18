export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.products.findUnique({
    where: {
      slug: params.slug,
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

  return NextResponse.json({
    ...product,
    product_id: Number(product.product_id),
    price: Number(product.price),
  });
}
