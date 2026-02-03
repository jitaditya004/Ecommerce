import jwt, { SignOptions } from "jsonwebtoken";

type Role = "USER" | "ADMIN";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type AccessTokenPayload = {
  user_id: string;
  role: Role;
  name: string;
  email: string;
};

type RefreshTokenPayload = {
  user_id: string;
};

export function createAccessToken(user: {
  user_id: bigint;
  role: Role;
  name: string;
  email: string;
}): string {

  if (!ACCESS_SECRET) {
    throw new Error("JWT access secrets not configured");
  }

  const payload: AccessTokenPayload = {
    user_id: user.user_id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] || "15m",
  };

  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function createRefreshToken(user: {
  user_id: bigint;
}): string {

  const payload: RefreshTokenPayload = {
    user_id: user.user_id.toString(),
  };

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] || "7d",
  };

  return jwt.sign(payload, REFRESH_SECRET, options);
}
