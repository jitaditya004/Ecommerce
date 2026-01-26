export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function GET() {

  const userId = await getUserIdFromRequest();

  if (!userId) {
    return NextResponse.json({ orders: [] }, { status: 401 });
  }


  const orders = await prisma.orders.findMany({
    where: {
      user_id: BigInt(userId),
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      order_id: true,
      status: true,
      payment_status: true,
      order_total: true,
      created_at: true,
    },
  });

  const formatted = orders.map(o => ({
    id: Number(o.order_id),
    status: o.status,
    payment_status: o.payment_status,
    total: Number(o.order_total),
    created_at: o.created_at,
  }));

  return NextResponse.json(
    { orders: formatted },
    { headers: { "Cache-Control": "no-store" } }
  );

}

