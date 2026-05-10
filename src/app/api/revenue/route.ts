import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today";

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: "cancelled" },
    },
    include: { items: true },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status === "completed"
  ).length;

  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      if (!itemCounts[item.itemName]) {
        itemCounts[item.itemName] = { name: item.itemName, count: 0, revenue: 0 };
      }
      itemCounts[item.itemName].count += item.quantity;
      itemCounts[item.itemName].revenue += item.unitPrice * item.quantity;
    }
  }

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    completedOrders,
    topItems,
    period,
  });
}
