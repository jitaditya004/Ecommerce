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
      // const items=await prisma.$transaction(async (tx)=>{
      //   // const cartItem = await tx.cart_items.findFirst({
      //   //   where: {
      //   //     id,
      //   //     carts: {
      //   //       user_id: BigInt(UserId)
      //   //     }
      //   //   },
      //   //   include:{
      //   //     products:true,
      //   //   }
      //   // });

      //   // if (!cartItem || !cartItem.products) {
      //   //   throw new Error("ITEM_NOT_FOUND");
      //   // }

      //   // const newQty = cartItem.quantity + delta;

      //   // const safeQty = Math.min(newQty, cartItem.products.stock);

      //   // if (safeQty <= 0) {
      //   //   await tx.cart_items.delete({ where: { id } });
      //   // } else {
      //   //   await tx.cart_items.update({
      //   //     where: { id },
      //   //     data: { quantity: safeQty },
      //   //   });
      //   // }



      //   const cartItem = await tx.cart_items.findFirst({
      //     where: {
      //       id,
      //       carts: {
      //         user_id: BigInt(UserId),
      //       },
      //     },
      //     include: {
      //       products: true,
      //     },
      //   });

      //   if (!cartItem) {
      //     throw new Error("ITEM_NOT_FOUND");
      //   }

      //   const newQty = cartItem.quantity + delta;

      //   if (newQty <= 0) {
      //     await tx.cart_items.deleteMany({
      //       where: {
      //         id,
      //         carts: { user_id: BigInt(UserId) },
      //       },
      //     });
      //   } else {
      //     const safeQty = Math.min(newQty, cartItem.products?.stock || 0);

      //     await tx.cart_items.updateMany({
      //       where: {
      //         id,
      //         carts: { user_id: BigInt(UserId) },
      //       },
      //       data: {
      //         quantity: safeQty,
      //       },
      //     });
      //   }




      //   // if (newQty <= 0) {
      //   //   await tx.cart_items.delete({
      //   //     where: { id },
      //   //   });
      //   // } else {
      //   //   await tx.cart_items.update({
      //   //     where: { id },
      //   //     data: {
      //   //       quantity: newQty,
      //   //     },
      //   //   });
      //   // }

      //   const updatedCart = await tx.cart_items.findMany({
      //     where: {
      //       carts: {
      //         user_id: BigInt(UserId),
      //       },
      //     },
      //     include: {
      //       products: {
      //         select: {
      //           name: true,
      //           price: true,
      //           image_url: true,
      //         },
      //       },
      //     },
      //     orderBy: {
      //       id: "asc",
      //     },
      //   });


      //   return updatedCart.map(i => ({
      //     id: Number(i.id),
      //     quantity: i.quantity,
      //     products: {
      //       name: i.products?.name,
      //       price: Number(i.products?.price),
      //       image_url: i.products?.image_url
      //     }
      //   }));
      // });


        const cartItem = await prisma.cart_items.findFirst({
          where: {
            id,
            carts: { user_id: BigInt(UserId) },
          },
          select: {
            quantity: true,
            products: {
              select: { stock: true },
            },
          },
        });

        if (!cartItem) {
          return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        if (delta > 0) {
          const result = await prisma.cart_items.updateMany({
            where: {
              id,
              carts: { user_id: BigInt(UserId) },
              quantity: {
                lt: cartItem.products?.stock || 0,
              },
            },
            data: {
              quantity: {
                increment: 1,
              },
            },
          });

          if (result.count === 0) {
            return NextResponse.json(
              { message: "Max stock reached" },
              { status: 400 }
            );
          }
        }

        if (delta < 0) {
          if (cartItem.quantity <= 1) {
            await prisma.cart_items.deleteMany({
              where: {
                id,
                carts: { user_id: BigInt(UserId) },
              },
            });
          } else {
            await prisma.cart_items.updateMany({
              where: {
                id,
                carts: { user_id: BigInt(UserId) },
              },
              data: {
                quantity: {
                  decrement: 1,
                },
              },
            });
          }
        }

        const updatedCart = await prisma.cart_items.findMany({
          where: {
            carts: {
              user_id: BigInt(UserId),
            },
          },
          include: {
            products: {
              select: {
                product_id: true,
                name: true,
                price: true,
                image_url: true,
                stock: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        });

        const items = updatedCart.map(i => ({
          id: Number(i.id),
          quantity: i.quantity,
          products: {
            product_id: i.products?.product_id,
            name: i.products?.name,
            price: Number(i.products?.price),
            image_url: i.products?.image_url,
            stock: i.products?.stock,
          },
        }));


        return NextResponse.json(
          { items }
        );
      }catch(err){
        console.error("CART UPDATE ERROR", err);

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

