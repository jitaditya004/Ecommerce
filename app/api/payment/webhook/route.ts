export const runtime = "nodejs";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {

  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId || !userId) {
      return new Response("Missing metadata", { status: 400 });
    }

    await prisma.$transaction(async (tx) => {

      const order = await tx.orders.findUnique({
        where: {
          order_id: BigInt(orderId),
        },
        include: {
          order_items: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.payment_status === "PAID") {
        return;
      }

      for (const item of order.order_items) {
        await tx.products.update({
          where: {
            product_id: item.product_id!,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.orders.update({
        where: {
          order_id: BigInt(orderId),
        },
        data: {
          payment_status: "PAID",
          status: "CONFIRMED",
        },
      });

      await tx.cart_items.deleteMany({
        where: {
          carts: {
            user_id: BigInt(userId),
          },
        },
      });

    });

  }

  return new Response("OK");
}