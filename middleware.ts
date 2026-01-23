export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("access")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { role: string };

    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};
