export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.products.findMany({
    where: {
      is_active: true,
    },
    select: {
      product_id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image_url: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formatted = products.map((p) => ({
    ...p,
    product_id: Number(p.product_id),
    price: Number(p.price),
  }));

  return NextResponse.json(formatted);
}
