export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  await prisma.cart_items.delete({
    where: { id },
  });

  return NextResponse.json([]);
}
