import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAdminFromRequest() {
  const token = (await cookies()).get("access")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { userId: string; role: string };

    if (payload.role !== "ADMIN") return null;

    return payload.userId;

  } catch {
    return null;
  }
}
