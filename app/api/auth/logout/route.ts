import { NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/types/cookieNames";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST() {

  const res = NextResponse.json({ message: "Logged out" });

  const cookieStore=await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refresh)?.value;

  if (refreshToken) {

    const tokens = await prisma.refresh_tokens.findMany({
      where: { revoked: false },
    });

    for (const t of tokens) {
      const match = await bcrypt.compare(refreshToken, t.token_hash);
      console.log("logout ;;match ",match)
      if (match) {
        await prisma.refresh_tokens.update({
          where: { id: t.id },
          data: { revoked: true },
        });
        break;
      }
    }
  }



  res.cookies.set(COOKIE_NAMES.access, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  res.cookies.set(COOKIE_NAMES.refresh, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
