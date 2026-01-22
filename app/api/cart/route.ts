// export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function GET() {

  const UserId = await getUserIdFromRequest();
  if (!UserId) {
    return NextResponse.json([], { status: 401 });
  }

  const cart = await prisma.carts.findFirst({
    where: { user_id: BigInt(UserId) },
    include: {
      cart_items: {
        orderBy:{ id: "asc" },
        include: {
          products: true,
        },
      },
    },
  });
  // console.log(cart?.cart_items);



  if (!cart) return NextResponse.json([]);

  const stat=await prisma.cart_items.aggregate({
    where: {cart_id: cart.cart_id},
    _sum:{quantity: true},
  });

  const totalAmount=cart.cart_items.reduce(
    (sum,item)=>sum+Number(item.products?.price || 0)*item.quantity,0
  )

  const items = cart.cart_items.map((item) => ({
    id: Number(item.id),
    quantity: item.quantity,
    products: {
      name: item.products?.name,
      price: Number(item.products?.price),
      image_url: item.products?.image_url,
    },
  }));

  return NextResponse.json({ totalAmount,count: stat._sum.quantity, items });
}
