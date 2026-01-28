export const runtime = "nodejs";


import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeProduct } from "@/helper/serializeProduct";
import type { UploadApiResponse } from "cloudinary";


function getPublicId(url: string) {
  const parts = url.split("/");
  const file = parts[parts.length - 1];
  return `products/${file.split(".")[0]}`;
}



export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  const product = await prisma.products.findUnique({
    where: {
      product_id: BigInt(params.id),
    },
  });

  return NextResponse.json(serializeProduct(product));
}



export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const formData = await req.formData();
  const params = await context.params;

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  const existing = await prisma.products.findUnique({
    where: {
      product_id: BigInt(params.id),
    },
  });

  let imageUrl = existing?.image_url || null;

  if (image) {
    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) reject(err);
            resolve(result as UploadApiResponse);
          }
        ).end(buffer);
      });

      imageUrl = upload.secure_url;

      // delete old image
      if (existing?.image_url) {
        const publicId = getPublicId(existing.image_url);
        await cloudinary.uploader.destroy(publicId);
      }

    } catch (err) {
      console.error("Cloudinary update failed:", err);

      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 500 }
      );
    }
  }

  const updated = await prisma.products.update({
    where: {
      product_id: BigInt(params.id),
    },
    data: {
      name,
      price: Number(price),
      image_url: imageUrl,
    },
  });

  return NextResponse.json(serializeProduct(updated));
}



export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const product = await prisma.products.findUnique({
    where: {
      product_id: BigInt(params.id),
    },
  });

  if (product?.image_url) {
    try {
      const publicId = getPublicId(product.image_url);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }
  }

  await prisma.products.delete({
    where: {
      product_id: BigInt(params.id),
    },
  });

  return NextResponse.json({ success: true });
}
