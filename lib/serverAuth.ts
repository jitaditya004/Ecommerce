import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


type JwtPayloadType = {
  userId: number;
};

export async function getUserIdFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return null;
    }

    return Number((decoded as JwtPayloadType).userId);

  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
