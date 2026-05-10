"use client";

import { useEffect, useState } from "react";
import SessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from "@/types";

interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  table: { number: number };
  items: { itemName: string; quantity: number; unitPrice: number }[];
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "preparing", label: "Đang chế biến" },
  { value: "ready", label: "Sẵn sàng" },
  { value: "completed", label: "Hoàn thành" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "completed",
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const params = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/orders${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (orderId: number, newStatus: OrderStatus) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Quản Lý Đơn Hàng</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Không có đơn hàng nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-sm">
                    #{order.orderNumber}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    Bàn {order.table.number}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ORDER_STATUS_COLORS[order.status]
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="text-sm text-gray-600 flex justify-between">
                    <span>
                      {item.itemName} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {order.note && (
                <div className="bg-yellow-50 rounded-lg p-2 mb-3 text-xs text-yellow-800">
                  📝 {order.note}
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-bold text-amber-600">
                  {formatCurrency(order.totalAmount)}
                </span>
                <div className="flex gap-2">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, NEXT_STATUS[order.status]!)
                      }
                      className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-amber-600 transition-colors"
                    >
                      → {ORDER_STATUS_LABELS[NEXT_STATUS[order.status]!]}
                    </button>
                  )}
                  {order.status !== "cancelled" &&
                    order.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="text-red-500 text-xs px-2 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        Hủy
                      </button>
                    )}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <SessionProvider>
      <AdminShell>
        <OrdersContent />
      </AdminShell>
    </SessionProvider>
  );
}
