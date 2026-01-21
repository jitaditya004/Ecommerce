export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function GET() {

  // const cookieStore = await cookies();
  // const token = cookieStore.get("refresh")?.value;

  // if (!token) {
  //   return NextResponse.json([], { status: 401 });
  // }

  // const payload = jwt.verify(
  //   token,
  //   process.env.REFRESH_TOKEN_SECRET!
  // ) as { userId: number };
  const UserId = await getUserIdFromRequest();
  if (!UserId) {
    return NextResponse.json([], { status: 401 });
  }

  const cart = await prisma.carts.findFirst({
    where: { user_id: BigInt(UserId) },
    include: {
      cart_items: {
        include: {
          products: true,
        },
      },
    },
  });
  console.log(cart?.cart_items);

  if (!cart) return NextResponse.json([]);

  const items = cart.cart_items.map((item) => ({
    id: Number(item.id),
    quantity: item.quantity,
    products: {
      name: item.products?.name,
      price: Number(item.products?.price),
      image_url: item.products?.image_url,
    },
  }));

  return NextResponse.json(items);
}
