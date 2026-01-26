import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const products = await prisma.products.findMany({
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    await writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  const product = await prisma.products.create({
    data: {
      name,
      price: Number(price),
      image_url: imageUrl,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    },
  });

  return NextResponse.json(product);
}
