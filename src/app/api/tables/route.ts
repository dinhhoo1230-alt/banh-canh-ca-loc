import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tables = await prisma.diningTable.findMany({
    where: { isActive: true },
    orderBy: { number: "asc" },
  });
  return NextResponse.json(tables);
}

export async function POST(request: Request) {
  const body = await request.json();
  const number = parseInt(body.number);

  if (!number || number <= 0) {
    return NextResponse.json(
      { error: "Số bàn không hợp lệ" },
      { status: 400 }
    );
  }

  const existing = await prisma.diningTable.findUnique({
    where: { number },
  });

  if (existing) {
    if (!existing.isActive) {
      const reactivated = await prisma.diningTable.update({
        where: { number },
        data: { isActive: true, name: body.name || existing.name },
      });
      return NextResponse.json(reactivated);
    }
    return NextResponse.json(
      { error: `Bàn số ${number} đã tồn tại` },
      { status: 400 }
    );
  }

  const table = await prisma.diningTable.create({
    data: {
      number,
      name: body.name || null,
      isActive: true,
    },
  });
  return NextResponse.json(table, { status: 201 });
}
