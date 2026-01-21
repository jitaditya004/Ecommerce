import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserIdFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { userId: string };

    return payload.userId;
  } catch {
    return null;
  }
}
