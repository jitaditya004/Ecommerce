export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json([]);
  }

  const products = await prisma.products.findMany({
    where: {
      is_active: true,
      OR: [
        {
          name: {
            startsWith: q,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
      ],
    },
    take: 20,
    select: {
      product_id: true,
      name: true,
      slug: true,
      price: true,
      image_url: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(
    products.map((p) => ({
      product_id: Number(p.product_id),
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      image_url: p.image_url,
    }))
  );
}