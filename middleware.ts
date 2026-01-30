export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { error } from "console";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("access")?.value;

  console.log("Middleware - Access Token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { role: string };

    console.log("Middleware - Token Payload:", payload);

    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

  } catch (error) {
    console.log("Middleware - Token verification failed", error);
    return NextResponse.redirect(new URL("/", req.url));
  }

}

//also add paths like user profile, orders, carts, etc. that require authentication
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",

  ],
};
