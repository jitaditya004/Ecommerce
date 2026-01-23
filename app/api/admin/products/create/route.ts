import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(req: Request) {

  const adminId = getAdminFromRequest();

  if (!adminId) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const data = await req.json();

  const product = await prisma.products.create({
    data,
  });

  return NextResponse.json(product);
}
