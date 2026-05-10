import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Trạng thái không hợp lệ" },
      { status: 400 }
    );
  }

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status },
    include: { table: true, items: true },
  });

  return NextResponse.json(order);
}
