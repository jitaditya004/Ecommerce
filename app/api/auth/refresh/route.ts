import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { Role } from "@/types/auth";

interface RefreshTokenPayload extends JwtPayload {
  user_id: string;
}

function isRole(value: unknown): value is Role {
  return value === "USER" || value === "ADMIN";
}

export async function POST() {

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh")?.value;

    if (!token) {
      return NextResponse.json({}, { status: 401 });
    }

    let payload: RefreshTokenPayload;

    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as RefreshTokenPayload;

    } catch {
      return NextResponse.json({}, { status: 401 });
    }

    if (!payload.user_id) {
      return NextResponse.json({}, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: {
        user_id: BigInt(payload.user_id),
      },
      select: {
        user_id: true,
        role: true,
        email: true,
        username: true,
      },
    });

    if (!user || !isRole(user.role)) {
      return NextResponse.json({}, { status: 401 });
    }

    const accessToken = createAccessToken({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      name: user.username,
    });

    const newRefresh=createRefreshToken({
      user_id: user.user_id,
    });

    console.log("Generated new refresh token:", newRefresh);
    console.log("Generated access token:", accessToken);

    const res = NextResponse.json({
      user: {
        id: Number(user.user_id),
        role: user.role,
        email: user.email,
        name: user.username,
      },
    });
    res.cookies.set("refresh",newRefresh,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY ?? 604800),
    });

    res.cookies.set("access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY ?? 900),
    });

    return res;

  } catch (error) {

    console.error("Refresh token error:", error);

    return NextResponse.json({message:"Unauthorized"}, { status: 401 });
  }
}
