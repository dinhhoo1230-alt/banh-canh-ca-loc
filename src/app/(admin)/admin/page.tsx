"use client";

import { useEffect, useState } from "react";
import SessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/utils";

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  topItems: { name: string; count: number; revenue: number }[];
}

function DashboardContent() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number>(0);

  useEffect(() => {
    fetch("/api/revenue?period=today")
      .then((r) => r.json())
      .then(setData);

    fetch("/api/orders?status=pending")
      .then((r) => r.json())
      .then((orders) => setPendingOrders(orders.length));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Doanh thu hôm nay</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {formatCurrency(data.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-2xl font-bold mt-1">{data.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Đã hoàn thành</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {data.completedOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Đang chờ xử lý</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {pendingOrders}
          </p>
        </div>
      </div>

      {data.topItems.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Món bán chạy hôm nay</h2>
          <div className="space-y-3">
            {data.topItems.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {item.count} phần - {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <SessionProvider>
      <AdminShell>
        <DashboardContent />
      </AdminShell>
    </SessionProvider>
  );
}
