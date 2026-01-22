export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const userId = await getUserIdFromRequest();
  const orderId = (await context.params).id;
  if (!userId || !orderId) {
    return NextResponse.json({}, { status: 401 });
  }

  const order = await prisma.orders.findFirst({
    where: {
      order_id: BigInt(orderId),
      user_id: BigInt(userId),
    },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({
    id: Number(order.order_id),
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    total: Number(order.order_total),
    created_at: order.created_at,
    items: order.order_items.map(i => ({
      id: Number(i.id),
      quantity: i.quantity,
      price: Number(i.price_at_purchase),
      product: {
        name: i.products?.name,
        image_url: i.products?.image_url,
      },
    })),
  });
}
