import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { Role } from "@/types/auth";
import { COOKIE_NAMES } from "@/types/cookieNames";
import bcrypt from "bcryptjs";
const ROTATE_THRESHOLD_SECONDS = 24 * 60 * 60; // 24 hours


interface RefreshTokenPayload extends JwtPayload {
  user_id: string;
}

function isRole(value: unknown): value is Role {
  return value === "USER" || value === "ADMIN";
}

export async function POST() {

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.refresh)?.value;


    console.log("auth refresh, refresh token: ",token);

    //if refresh token exists or not
    if (!token) {
      return NextResponse.json({}, { status: 401 });
    }

    let payload: RefreshTokenPayload;

    //verify current refresh token
    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as RefreshTokenPayload;

    } catch(err) {
      console.error("JWT verify failed:", err);
      return NextResponse.json({}, { status: 401 });
    }

    //means token is expired
    if (!payload.user_id) {
      return NextResponse.json({}, { status: 401 });
    }

    //get user from token
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

    //user does not exist or like any other role which dont allow buying items even if logged in
    if (!user || !isRole(user.role)) {
      return NextResponse.json({}, { status: 401 });
    }

    //check tokens in database
    //get all tokens from db, with revoked false
    const dbTokens = await prisma.refresh_tokens.findMany({
      where: {
        user_id: BigInt(payload.user_id),
        revoked: false,
      },
    });

    let matchedToken = null;

      for (const t of dbTokens) {
        const isMatch = await bcrypt.compare(token, t.token_hash);

        if (isMatch) {
          matchedToken = t;
          break;
        }
      }

      //token not in db
      if (!matchedToken) {
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
      }

      //
      if (matchedToken.expires_at < new Date()) {
        return NextResponse.json({ message: "Refresh token expired" }, { status: 401 });
      }

      const now = Date.now();

      const expiresInSeconds =
        Math.floor((matchedToken.expires_at.getTime() - now) / 1000);

        //rotate token if closer to expiry
      const shouldRotate =
        expiresInSeconds < ROTATE_THRESHOLD_SECONDS;

      //create new access token...chnge it later , add access token checks
    const accessToken = createAccessToken({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      name: user.username,
    });

    // const newRefresh=createRefreshToken({
    //   user_id: user.user_id,
    // });


    let refreshTokenToSend = token;

    if (shouldRotate) {

      const newRefresh = createRefreshToken({
        user_id: user.user_id,
      });

      const newRefreshHash = await bcrypt.hash(newRefresh, 10);

      //set previous token to revoked true
      await prisma.$transaction([
        prisma.refresh_tokens.update({
          where: { id: matchedToken.id },
          data: { revoked: true },
        }),

        prisma.refresh_tokens.create({
          data: {
            user_id: user.user_id,
            token_hash: newRefreshHash,
            expires_at: new Date(
              Date.now() +
                Number(process.env.REFRESH_TOKEN_EXPIRY || 604800) * 1000
            ),
          },
        }),
      ]);

      refreshTokenToSend = newRefresh;
    }

    console.log("Generated access token:", accessToken);

    const res = NextResponse.json({
      user: {
        id: Number(user.user_id),
        role: user.role,
        email: user.email,
        name: user.username,
      },
    });
    res.cookies.set(COOKIE_NAMES.refresh,refreshTokenToSend,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY || 604800),
    });

    res.cookies.set(COOKIE_NAMES.access, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY || 900),
    });

    console.log("Refresh exp:", payload.exp);
  console.log("Now:", Math.floor(Date.now() / 1000));


    return res;

  } catch (error) {

    console.error("Refresh token error:", error);

    return NextResponse.json({message:"Unauthorized"}, { status: 401 });
  }
}
