export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {

  const { productId } = await req.json();

  const userId = await getUserIdFromRequest();

  if (!userId || !productId) {
    return NextResponse.json({}, { status: 401 });
  }

  const exists = await prisma.wishlist.findFirst({
    where: {
      user_id: BigInt(userId),
      product_id: BigInt(productId),
    },
  });

  if (exists) {
    await prisma.wishlist.delete({
      where: {
        id: exists.id,
      },
    });

    return NextResponse.json({ wishlisted: false });
  }

  await prisma.wishlist.create({
    data: {
      user_id: BigInt(userId),
      product_id: BigInt(productId),
    },
  });

  return NextResponse.json({ wishlisted: true });
}
