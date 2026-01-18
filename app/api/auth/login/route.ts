import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import {
  createAccessToken,
  createRefreshToken,
} from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const user = result.rows[0];

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

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const res = NextResponse.json({
    accessToken,
    user: {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
  });

res.cookies.set("refresh", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});


  return res;
}
