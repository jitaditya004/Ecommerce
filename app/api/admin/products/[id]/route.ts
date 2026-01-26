import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.products.findUnique({
    where: {
      product_id: BigInt(params.id),
    },
  });

  return NextResponse.json(product);
}


export async function PUT(req: Request, { params }: any) {
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  let imageUrl;

  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "products" },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      ).end(buffer);
    });

    imageUrl = upload.secure_url;
  }

  const updated = await prisma.products.update({
    where: {
      product_id: BigInt(params.id),
    },
    data: {
      name,
      price: Number(price),
      ...(imageUrl && { image_url: imageUrl }),
    },
  });

  return NextResponse.json(updated);
}



export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.products.delete({
    where: {
      product_id: BigInt(params.id),
    },
  });

  return NextResponse.json({ success: true });
}
