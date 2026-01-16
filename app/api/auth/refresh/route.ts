import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { createAccessToken } from "@/lib/auth";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}


export async function POST() {
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

  const result = await pool.query(
    "SELECT user_id, role FROM users WHERE user_id = $1",
    [payload.userId]
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { accessToken: "" },
      { status: 401 }
    );
  }

  const accessToken = createAccessToken(result.rows[0]);

  return NextResponse.json({
    accessToken,
    user: {
      id: result.rows[0].user_id,
      role: result.rows[0].role,
    },
  });

}
