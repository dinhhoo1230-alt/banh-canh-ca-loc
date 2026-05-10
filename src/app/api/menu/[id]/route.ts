import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.menuItem.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      categoryId: body.categoryId,
      isAvailable: body.isAvailable,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.menuItem.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
