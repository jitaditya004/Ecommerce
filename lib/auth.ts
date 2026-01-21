import jwt from "jsonwebtoken";

export function createAccessToken(user: {
  user_id: bigint;
  role: string;
  name: string;
  email: string;
}) {
  return jwt.sign(
    { userId: user.user_id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
}

export function createRefreshToken(user: {
  user_id: bigint;
}) {
  return jwt.sign(
    { userId: user.user_id.toString() },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
}
