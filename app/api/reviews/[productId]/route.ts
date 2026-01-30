export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {

  const { productId } = await context.params;

  const reviews = await prisma.reviews.findMany({
    where: {
      product_id: BigInt(productId),
    },
    include: {
      users: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json({
    reviews: reviews.map(r => ({
      id: Number(r.id),
      rating: r.rating,
      content: r.content,
      user: r.users?.username,
      created_at: r.created_at,
    }))
});
}
