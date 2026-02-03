export const runtime = "nodejs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { COOKIE_NAMES } from "./types/cookieNames";

type JwtPayload = {
  user_id: string;
  role: "USER" | "ADMIN";
  name: string;
};

export function middleware(req: NextRequest) {

  const token = req.cookies.get(COOKIE_NAMES.access)?.value;

  console.log("Middleware - Access Token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("x-user-id", payload.user_id);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-name", payload.name);

        // Admin route protection
    if (
      req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/api/admin")
    ) {
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.log("Middleware - Token verification failed", error);
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/user/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/cart/:path*"
  ],
};
