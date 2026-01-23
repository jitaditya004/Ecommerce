export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function GET() {

  const userId = await getUserIdFromRequest();

  if (!userId) {
    return NextResponse.json([], { status: 401 });
  }

  const list = await prisma.wishlist.findMany({
    where: {
      user_id: BigInt(userId),
    },
    include: {
      products: true,
    },
  });

  return NextResponse.json(
    list.map(i => ({
      id: Number(i.products?.product_id),
      name: i.products?.name,
      price: Number(i.products?.price),
      image_url: i.products?.image_url,
    }))
  );
}
