export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AccessPayload = {
  user_id: string;
};  

export async function POST(req: Request) {
  const { productId, quantity } = await req.json();

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID required" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json(
      { message: "Invalid quantity" },
      { status: 400 }
    );
  }

  const token = (await cookies()).get("access")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
console.log("Token:", token);

  let payload: AccessPayload;

  try {
    payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessPayload;
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }


  const userId = BigInt(payload.user_id);

  if(!userId){
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }


  try {
    const count = await prisma.$transaction(async (tx) => {

     
      let cart = await tx.carts.findFirst({
        where: { user_id: userId },
      });

      if (!cart) {
        cart = await tx.carts.create({
          data: {
            user_id: userId,
          },
        });
      }

      const existingItem = await tx.cart_items.findFirst({
        where: {
          cart_id: cart.cart_id,
          product_id: productId,
        },
      });

    
      if (existingItem) {

        await tx.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: {
              increment: quantity, 
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

      const result = await tx.cart_items.aggregate({
        where: { cart_id: cart.cart_id },
        _sum: {
          quantity: true,
        },
      });

      return result._sum.quantity || 0;

    });


    return NextResponse.json({ count,message: "Added to cart" });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
