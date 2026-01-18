export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, delta } = await req.json();

  const item = await prisma.cart_items.findUnique({
    where: { id },
  });

  if (!item) {
    return NextResponse.json([], { status: 404 });
  }

  if (item.quantity + delta <= 0) {
    await prisma.cart_items.delete({
      where: { id },
    });
  } else {
    await prisma.cart_items.update({
      where: { id },
      data: {
        quantity: item.quantity + delta,
      },
    });
  }

  return NextResponse.json([]);
}
