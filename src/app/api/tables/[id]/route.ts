import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.diningTable.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });
  return NextResponse.json({ success: true });
}
