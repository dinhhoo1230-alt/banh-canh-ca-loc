import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tableId = searchParams.get("tableId");
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (tableId) where.tableId = parseInt(tableId);
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    where.createdAt = { gte: start, lt: end };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      table: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tableId, items, note } = body;

  if (!tableId || !items || items.length === 0) {
    return NextResponse.json(
      { error: "Vui lòng chọn bàn và ít nhất 1 món" },
      { status: 400 }
    );
  }

  const menuItemIds = items.map((i: { menuItemId: number }) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));
  let totalAmount = 0;
  const orderItems = items.map(
    (item: { menuItemId: number; quantity: number }) => {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) throw new Error(`Món #${item.menuItemId} không tồn tại`);
      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        itemName: menuItem.name,
      };
    }
  );

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      tableId,
      totalAmount,
      note: note || null,
      items: { create: orderItems },
    },
    include: {
      table: true,
      items: true,
    },
  });

  return NextResponse.json(order, { status: 201 });
}
