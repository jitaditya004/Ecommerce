export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    
    const result = await prisma.$transaction(async (tx) => {

     
      const existing = await tx.users.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ],
        },
        select: { user_id: true },
      });

      if (existing) {
        throw new Error("USER_EXISTS");
      }

      
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await tx.users.create({
        data: {
          email,
          username,
          password_hash: passwordHash,
        },
        select: {
          user_id: true,
          email: true,
          role: true,
        },
      });

      return user;
    });

   
    return NextResponse.json(
      {
        message: "User created",
        user: {
          id: Number(result.user_id), // BigInt safe
          email: result.email,
          role: result.role,
        },
      },
      { status: 201 }
    );

  }catch (error: unknown) {

    if (error instanceof Error) {

      if (error.message === "USER_EXISTS") {
        return NextResponse.json(
          { message: "Email or username already exists" },
          { status: 409 }
        );
      }

      console.error(error.message);

    } else {
      console.error("Unknown error", error);
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }

}
