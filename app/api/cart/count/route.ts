import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";


export async function GET() {
  const userId = await getUserIdFromRequest();

  if (!userId) return NextResponse.json({ count: 0 }, { status: 401 });

  const cart = await prisma.carts.findFirst({
    where: { user_id: BigInt(userId) },
  });

  if (!cart) {
    return NextResponse.json({ count: 0 });
  }

  const result = await prisma.cart_items.aggregate({
    where: { cart_id: cart.cart_id },
    _sum: {
      quantity: true,
    },
  });

  const count = result._sum.quantity || 0;

  return NextResponse.json({ count });
}
