import { prisma } from "@/src/lib/prisma";
import { formToApiData, preorderSchema } from "@/src/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const preorder = await prisma.preorder.findUnique({
      where: { id: params.id },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error fetching preorder:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorder" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const apiData = formToApiData(body);
    const validatedData = preorderSchema.parse(apiData);

    const preorder = await prisma.preorder.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        products: validatedData.products,
        preorderWhen: validatedData.preorderWhen,
        startsAt: new Date(validatedData.startsAt),
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
        status: validatedData.status || "active",
      },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error updating preorder:", error);
    return NextResponse.json(
      { error: "Failed to update preorder" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.preorder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting preorder:", error);
    return NextResponse.json(
      { error: "Failed to delete preorder" },
      { status: 500 },
    );
  }
}
