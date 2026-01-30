export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {

  const body = await req.json();
  const productId = Number(body.productId);

  if (!Number.isInteger(productId)) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
  }

  const userId = await getUserIdFromRequest();
  console.log("Toggling wishlist for user:", userId, "product:", productId);

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
