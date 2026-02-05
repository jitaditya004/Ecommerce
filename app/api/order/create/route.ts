//create order
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST() {

  const userId = await getUserIdFromRequest();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("USER:", userId);


  try {

    const order = await prisma.$transaction(async (tx) => {

      const existingOrder = await tx.orders.findFirst({
        where: {
          user_id: BigInt(userId),
          payment_status: "UNPAID",
          status: "PENDING",
        },
      });

      if (existingOrder) {
        return existingOrder;
      }

      const cart = await tx.carts.findFirst({
        where: { user_id: BigInt(userId) },
        include: {
          cart_items: {
            include: { products: true },
          },
        },
      });

      console.log("CART:", cart);


      if (!cart || cart.cart_items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      const total = cart.cart_items.reduce(
        (sum, item) =>
          sum + Number(item.products?.price || 0) * item.quantity,
        0
      );

      const newOrder = await tx.orders.create({
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

      return newOrder;
    });
    console.log("ORDER CREATED:", order.order_id);


    return NextResponse.json({
      orderId: Number(order.order_id),
    });

  } catch (err: unknown) {

    if (err instanceof Error) {

    if (err.message === "CART_EMPTY") {
      return NextResponse.json(
        { message: "Cart empty" },
        { status: 400 }
      );
    }

    console.error("ORDER ERROR:", err.message);

  } else {

    console.error("ORDER ERROR:", err);
  }

    return NextResponse.json(
      { message: "Order creation failed" },
      { status: 500 }
    );
  }
}

