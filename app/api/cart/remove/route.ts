export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {

  const { id } = await req.json();

  const userId = await getUserIdFromRequest();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.cart_items.delete({
    where: {
      id,
      carts: {
        user_id: BigInt(userId),
      },
    },
  });

  const updatedCart = await prisma.cart_items.findMany({
    where: {
      carts: {
        user_id: BigInt(userId),
      },
    },
    include: {
      products: {
        select: {
          name: true,
          price: true,
          image_url: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(
    updatedCart.map(i => ({
      id: Number(i.id),
      quantity: i.quantity,
      products: {
        name: i.products?.name,
        price: Number(i.products?.price),
        image_url: i.products?.image_url,
      },
    }))
  );
}
