export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { serializeProduct } from "@/helper/serializeProduct";
import type { UploadApiResponse } from "cloudinary";


export async function GET() {
  const products = await prisma.products.findMany({
    orderBy: { created_at: "desc" },
  });

  const formatted = products.map(p => ({
    ...p,
    product_id: Number(p.product_id),
  }));

  return NextResponse.json({ products: formatted });
}


export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image) {
    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            resolve(result as UploadApiResponse);
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;

    } catch (err) {
      console.error("Cloudinary upload failed:", err);

      // Optional: still allow product creation
      imageUrl = null;
    }
  }

  const product = await prisma.products.create({
    data: {
      name,
      price: Number(price),
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      image_url: imageUrl,
    },
  });

  return NextResponse.json(serializeProduct(product));
}
