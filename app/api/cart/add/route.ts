export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { productId, quantity } = await req.json();

  const token = (await cookies()).get("refresh")?.value;

   console.log(token);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const payload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as { userId: number };


  try {
    await prisma.$transaction(async (tx) => {

      // 1️⃣ Find or create cart
      let cart = await tx.carts.findFirst({
        where: { user_id: payload.userId },
      });

      if (!cart) {
        cart = await tx.carts.create({
          data: {
            user_id: payload.userId,
          },
        });
      }

      // 2️⃣ Check if product already in cart
      const existingItem = await tx.cart_items.findFirst({
        where: {
          cart_id: cart.cart_id,
          product_id: productId,
        },
      });

      // 3️⃣ Update or Insert
      if (existingItem) {
        await tx.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: {
              increment: quantity, // ATOMIC OP
            },
          },
        });
      } else {
        await tx.cart_items.create({
          data: {
            cart_id: cart.cart_id,
            product_id: productId,
            quantity,
          },
        });
      }

    });

    return NextResponse.json({ message: "Added to cart" });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
