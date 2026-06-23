import { prisma } from "@/src/lib/prisma";
import { formToApiData, preorderSchema } from "@/src/lib/validations";
import { NextRequest, NextResponse } from "next/server";
// import { prisma } from '@/lib/prisma';
// import { preorderSchema, formToApiData } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (filter === "active") {
      where.status = "active";
    } else if (filter === "inactive") {
      where.status = "inactive";
    }

    // Build order by
    const orderBy: any = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "products") {
      orderBy.products = sortOrder;
    } else if (sortBy === "startsAt") {
      orderBy.startsAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Get total count for pagination
    const total = await prisma.preorder.count({ where });

    // Get preorders
    const preorders = await prisma.preorder.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: preorders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching preorders:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiData = formToApiData(body);
    const validatedData = preorderSchema.parse(apiData);

    const preorder = await prisma.preorder.create({
      data: {
        name: validatedData.name,
        products: validatedData.products,
        preorderWhen: validatedData.preorderWhen,
        startsAt: new Date(validatedData.startsAt),
        endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : null,
        status: validatedData.status || "active",
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error("Error creating preorder:", error);
    return NextResponse.json(
      { error: "Failed to create preorder" },
      { status: 500 },
    );
  }
}
