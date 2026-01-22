export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST() {

  const userId = await getUserIdFromRequest();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cart = await prisma.carts.findFirst({
    where: { user_id: BigInt(userId) },
    include: {
      cart_items: {
        include: { products: true },
      },
    },
  });

  if (!cart || cart.cart_items.length === 0) {
    return NextResponse.json({ message: "Cart empty" }, { status: 400 });
  }

  const total = cart.cart_items.reduce(
    (sum, item) =>
      sum + Number(item.products?.price || 0) * item.quantity,
    0
  );

  const order = await prisma.orders.create({
    data: {
      user_id: BigInt(userId),
      order_total: total,
      status: "PENDING",
      payment_status: "UNPAID",
      order_items: {
        create: cart.cart_items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.products?.price || 0,
        })),
      },
    },
  });

  return NextResponse.json({
    orderId: Number(order.order_id),
  });
}
