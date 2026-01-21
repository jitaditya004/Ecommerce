export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";



export async function POST(req: Request) {
  const { id, delta } = await req.json();

const UserId = await getUserIdFromRequest();

if (!UserId) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

  const item = await prisma.cart_items.findFirst({
    where: {
      id,
      carts: {
        user_id: BigInt(UserId)
      }
    },
  });

  if (!item) {
    return NextResponse.json([], { status: 404 });
  }

  if (item.quantity + delta <= 0) {
    await prisma.cart_items.delete({
      where: { id },
    });
  } else {
    await prisma.cart_items.update({
      where: { id },
      data: {
        quantity: item.quantity + delta,
      },
    });
  }

  const updatedCart = await prisma.cart_items.findMany({
    where: {
      carts: {
        user_id: BigInt(UserId),
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
  });

  return NextResponse.json(
  updatedCart.map(i => ({
    id: Number(i.id),
    quantity: i.quantity,
    products: {
      name: i.products?.name,
      price: Number(i.products?.price),
      image_url: i.products?.image_url
    }
  }))
);
}

