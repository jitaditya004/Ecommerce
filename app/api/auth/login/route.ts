import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
} from "@/lib/auth";
import { Role } from "@/types/auth";
import { COOKIE_NAMES } from "@/types/cookieNames";
import { hashToken } from "@/helper/SHAhelper";

function isRole(value: unknown): value is Role {
  return value === "USER" || value === "ADMIN";
}

export async function POST(req: Request) {

  try {
    const body = await req.json();

    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { email, password } = body;

    //find user with the email

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        username: true,
        password_hash: true,
        role: true,
      },
    });
    //no user 
    if (!user || !isRole(user.role)) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );
    
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }


    const accessToken = createAccessToken({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      name: user.username,
    });



    const refreshToken = await prisma.$transaction(async (tx) => {
      const dbToken = await tx.refresh_tokens.create({
        data: {
          user_id: user.user_id,
          token_hash: "",
          expires_at: new Date(
            Date.now() +
              Number(process.env.REFRESH_TOKEN_EXPIRY || 604800) * 1000,
          ),
        },
      });

      const token = createRefreshToken({
        user_id: user.user_id,
        token_id: dbToken.id,
      });

      await tx.refresh_tokens.update({
        where: {
          id: dbToken.id,
        },
        data: {
          token_hash: hashToken(token),
        },
      });

      return token;
    });



    const res = NextResponse.json({
      user: {
        id: Number(user.user_id),
        email: user.email,
        role: user.role,
        name: user.username,
      },
    });


    res.cookies.set(COOKIE_NAMES.access, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY || 15 * 60),
      priority: "high",
    });

    res.cookies.set(COOKIE_NAMES.refresh, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY || 7 * 24 * 60 * 60),
      priority: "high",
    });

    return res;

  } catch (error) {

    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }

}
