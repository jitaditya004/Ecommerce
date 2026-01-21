import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createAccessToken } from "@/lib/auth";
import { parse } from "path";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh")?.value;

    if (!token) {
      return NextResponse.json(
        { accessToken: "" },
        { status: 401 }
      );
    }

    let payload: RefreshTokenPayload;

    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as RefreshTokenPayload;
    } catch {
      return NextResponse.json(
        { accessToken: "" },
        { status: 401 }
      );
    }

    if (!payload.userId) {
      return NextResponse.json(
        { accessToken: "" },
        { status: 401 }
      );
    }

    
    const user = await prisma.users.findUnique({
      where: {
        user_id: BigInt(payload.userId),
      },
      select: {
        user_id: true,
        role: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { accessToken: "" },
        { status: 401 }
      );
    }


    const accessToken = createAccessToken({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      name: user.username
    });

   const res = NextResponse.json({
      accessToken,
      user: {
        id: Number(user.user_id),
        role: user.role,
        email: user.email,
        name: user.username,
      },
    });

    res.cookies.set("access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY || "0", 10)
    });

    return res;


  } catch (error) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      { accessToken: "" },
      { status: 500 }
    );
  }
}
