export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // check existing user
  const existing = await pool.query(
    "SELECT user_id FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );

  if (existing.rows.length > 0) {
    return NextResponse.json(
      { message: "Email or username already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING user_id, email, role
    `,
    [email, username, passwordHash]
  );

  return NextResponse.json(
    {
      message: "User created",
      user: result.rows[0],
    },
    { status: 201 }
  );
}
