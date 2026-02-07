export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/serverAuth";



export async function POST(req: Request) {
  const { id, delta } = await req.json();

const UserId = await getUserIdFromRequest();

if (!UserId) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

  try{
      const items=await prisma.$transaction(async (tx)=>{
        const cartItem = await tx.cart_items.findFirst({
          where: {
            id,
            carts: {
              user_id: BigInt(UserId)
            }
          },
          include:{
            products:true,
          }
        });

        if (!cartItem || !cartItem.products) {
          throw new Error("ITEM_NOT_FOUND");
        }

        const newQty = cartItem.quantity + delta;

        const safeQty = Math.min(newQty, cartItem.products.stock);

        if (safeQty <= 0) {
          await tx.cart_items.delete({ where: { id } });
        } else {
          await tx.cart_items.update({
            where: { id },
            data: { quantity: safeQty },
          });
        }



        // if (newQty <= 0) {
        //   await tx.cart_items.delete({
        //     where: { id },
        //   });
        // } else {
        //   await tx.cart_items.update({
        //     where: { id },
        //     data: {
        //       quantity: newQty,
        //     },
        //   });
        // }

        const updatedCart = await tx.cart_items.findMany({
          where: {
            carts: {
              user_id: BigInt(UserId),
            },
          },
          include: {
            products: {
              select: {
                name: true,
                price: true,
                image_url: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        });


        return updatedCart.map(i => ({
          id: Number(i.id),
          quantity: i.quantity,
          products: {
            name: i.products?.name,
            price: Number(i.products?.price),
            image_url: i.products?.image_url
          }
        }));
      });

        return NextResponse.json(
          { items }
        );
      }catch(err){
         if (err instanceof Error && err.message === "OUT_OF_STOCK") {
            return NextResponse.json(
              { message: "Product is out of stock" },
              { status: 400 }
            );
          }

          return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
      }

}

