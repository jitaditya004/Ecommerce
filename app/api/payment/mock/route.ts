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

  if (order.payment_status === "PAID") {
    return NextResponse.json({
      success: true,
      message: "Already paid"
    });
  }


  const paymentSuccess = Math.random() > 0.2;

  if (!paymentSuccess) {
    return NextResponse.json({ success: false });
  }

  const result = await prisma.$transaction(async (tx) => {

    const orderUpdate = await tx.orders.updateMany({
      where: {
        order_id: BigInt(orderId),
        user_id: BigInt(userId),
        payment_status: "UNPAID",
      },
      data: {
        payment_status: "PAID",
        status: "CONFIRMED",
        payment_method: method,
        reference_id: `TXN_${Date.now()}`,
      },
    });

    if (orderUpdate.count === 0) {
      throw new Error("ORDER_UPDATE_FAILED");
    }

    await tx.cart_items.deleteMany({
      where: {
        carts: {
          user_id: BigInt(userId),
        },
      },
    });

    return true;
  });

  if (result === false) {
    return NextResponse.json(
      { success: false, message: "Order not updated" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
