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
  period: string;
}

const PERIODS = [
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "Tháng này" },
];

function RevenueContent() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [period, setPeriod] = useState("today");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/revenue?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Thống Kê Doanh Thu</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {formatCurrency(data.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-3xl font-bold mt-2">{data.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Đã hoàn thành</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.completedOrders}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Top món bán chạy</h2>
        {data.topItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-4">
            {data.topItems.map((item, i) => {
              const maxCount = data.topItems[0].count;
              const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.count} phần - {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminRevenuePage() {
  return (
    <SessionProvider>
      <AdminShell>
        <RevenueContent />
      </AdminShell>
    </SessionProvider>
  );
}
