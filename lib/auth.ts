import jwt from "jsonwebtoken";

export function createAccessToken(user: {
  user_id: bigint;
  role: string;
}) {
  return jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
}

export function createRefreshToken(user: {
  user_id: bigint;
}) {
  return jwt.sign(
    { userId: user.user_id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
}
