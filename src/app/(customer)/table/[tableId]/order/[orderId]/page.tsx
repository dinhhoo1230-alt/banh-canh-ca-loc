"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderStatusTracker from "@/components/customer/OrderStatusTracker";
import VietQRPayment from "@/components/customer/VietQRPayment";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface OrderData {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  table: { number: number };
  items: {
    id: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    const res = await fetch(`/api/orders/${orderId}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-xl font-bold">Không tìm thấy đơn hàng</h2>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold">Đơn #{order.orderNumber}</h2>
          <span className="text-sm text-gray-500">
            Bàn {order.table.number}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold mb-3">Trạng thái đơn hàng</h3>
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold mb-3">Chi tiết đơn hàng</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.itemName} x{item.quantity}
              </span>
              <span className="font-medium">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span className="text-amber-600">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
        {order.note && (
          <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
            <span className="font-medium">Ghi chú:</span> {order.note}
          </div>
        )}
      </div>

      {order.status === "pending" || order.status === "confirmed" ? (
        <VietQRPayment
          amount={order.totalAmount}
          orderNumber={order.orderNumber}
        />
      ) : null}

      <button
        onClick={() => router.push(`/table/${tableId}/menu`)}
        className="w-full bg-stone-900 text-amber-100 font-bold py-3 px-6 rounded-xl hover:bg-stone-800 transition-colors border-b-4 border-amber-500"
      >
        🌾 Đặt Thêm Món
      </button>
    </div>
  );
}
