import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ REQUIRED in Next 15

    if (!id) {
      return NextResponse.json(
        { error: "Paste id is required" },
        { status: 400 }
      );
    }

    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return NextResponse.json(
        { error: "View limit reached" },
        { status: 410 }
      );
    }

    const updatedPaste = await prisma.paste.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    return NextResponse.json(updatedPaste);
  } catch (error) {
    console.error("GET PASTE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
