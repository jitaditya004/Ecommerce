export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {

  const { orderId, method } = await req.json();

  const userId = await getUserIdFromRequest();

  if (!userId || !orderId) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const order = await prisma.orders.findFirst({
    where: {
      order_id: BigInt(orderId),
      user_id: BigInt(userId),
    },
  });

  if (!order) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const paymentSuccess = Math.random() > 0.2;

  if (!paymentSuccess) {
    return NextResponse.json({ success: false });
  }

  await prisma.$transaction([
    prisma.orders.update({
      where: { order_id: BigInt(orderId) },
      data: {
        payment_status: "PAID",
        status: "CONFIRMED",
        payment_method: method,
        reference_id: `TXN_${Date.now()}`,
      },
    }),

    prisma.cart_items.deleteMany({
      where: {
        carts: {
          user_id: BigInt(userId),
        },
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
