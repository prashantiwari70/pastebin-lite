import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, expiresAt, maxViews } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const paste = await prisma.paste.create({
      data: {
        content,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxViews: maxViews ?? null,
      },
    });

    return NextResponse.json(paste, { status: 201 });
  } catch (error) {
    console.error("CREATE PASTE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 }
    );
  }
}
