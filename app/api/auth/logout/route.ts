import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAMES } from "@/types/cookieNames";

type RefreshPayload = {
  user_id: string;
  token_id: string;
};

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out",
  });

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refresh)?.value;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as RefreshPayload;

      if (payload.user_id && payload.token_id) {
        await prisma.refresh_tokens.updateMany({
          where: {
            id: BigInt(payload.token_id),
            user_id: BigInt(payload.user_id),
            revoked: false,
          },
          data: {
            revoked: true,
          },
        });
      }
    } catch {}
  }

  response.cookies.delete(COOKIE_NAMES.access);
  response.cookies.delete(COOKIE_NAMES.refresh);

  return response;
}
