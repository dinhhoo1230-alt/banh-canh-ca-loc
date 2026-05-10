import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      menuItems: {
        where: { isAvailable: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: body.price,
      image: body.image || null,
      categoryId: body.categoryId,
      isAvailable: body.isAvailable ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
