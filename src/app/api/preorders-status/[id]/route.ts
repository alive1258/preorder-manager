import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { status } = await request.json();

    const preorder = await prisma.preorder.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
