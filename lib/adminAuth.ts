import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AccessTokenPayload = {
  user_id: string;
  role: "USER" | "ADMIN";
  email: string;
  name: string;
};

export async function getAdminFromRequest(): Promise<string | null> {

  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    if (payload.role !== "ADMIN") {
      return null;
    }

    return payload.user_id.toString();

  } catch (error) {
    console.error("Error verifying admin token:", error);
    return null;
  }
}
