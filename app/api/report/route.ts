import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.issueReport.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to submit issue" },
      { status: 500 }
    );
  }
}
