export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {

  const { productId, rating, content } = await req.json();

  const userId = await getUserIdFromRequest();

  if (!userId || !productId) {
    return NextResponse.json({}, { status: 401 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({}, { status: 400 });
  }

  const review = await prisma.reviews.upsert({
    where: {
      product_id_user_id: {
        product_id: BigInt(productId),
        user_id: BigInt(userId),
      },
    },
    update: {
      rating,
      content,
    },
    create: {
      product_id: BigInt(productId),
      user_id: BigInt(userId),
      rating,
      content,
    },
  });

  return NextResponse.json({
    id: Number(review.id),
    rating: review.rating,
    content: review.content,
  });
}
