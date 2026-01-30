import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AccessTokenPayload = {
  user_id: string;
  role: "USER" | "ADMIN";
  email: string;
  name: string;
};

export async function getUserIdFromRequest(): Promise<bigint | null> {

  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    if (!decoded.user_id) {
      return null;
    }

    return BigInt(decoded.user_id);

  } catch (error) {

   
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return null;
    }

    console.error("JWT verify failed:", error);
    return null;
  }
}
