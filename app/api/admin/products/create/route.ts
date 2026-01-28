import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image) {
    try {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }

      if (image.size > 2_000_000) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }

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
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
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

  return NextResponse.json(
    { success: true, product },
    { status: 201 }
  );

}
