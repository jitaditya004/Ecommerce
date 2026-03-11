export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";


const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  
  try {
    const stripe = getStripe();
    
    const { orderId } = await req.json();

    const userId = await getUserIdFromRequest();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.orders.findFirst({
      where: {
        order_id: BigInt(orderId),
        user_id: BigInt(userId),
      },
      include: {
        order_items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const line_items = order.order_items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: `Product ${item.product_id}`,
        },
        unit_amount: Number(item.price_at_purchase) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success?orderId=${orderId}`,
      cancel_url: `${baseUrl}/payment?orderId=${orderId}`,
      metadata: {
        orderId: String(orderId),
        userId: String(userId),
      },
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (err) {
    console.error("Stripe session error:", err);

    return NextResponse.json(
      { message: "Stripe session creation failed" },
      { status: 500 }
    );
  }
}