"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import CartItem from "@/components/customer/CartItem";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = parseInt(params.tableId as string);
  const { items, totalAmount, clearCart } = useCartStore();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = totalAmount();

  const handleOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          note,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Lỗi đặt món");

      const order = await res.json();
      clearCart();
      router.push(`/table/${tableId}/order/${order.id}`);
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
        <span className="text-5xl mb-4">🛒</span>
        <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Hãy chọn món từ thực đơn nhé!</p>
        <button
          onClick={() => router.push(`/table/${tableId}/menu`)}
          className="bg-stone-900 text-amber-100 font-bold py-3 px-6 rounded-xl hover:bg-stone-800 transition-colors border-b-4 border-amber-500"
        >
          🌾 Xem Thực Đơn
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Giỏ Hàng</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Bàn {tableId}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        {items.map((item) => (
          <CartItem key={item.menuItemId} {...item} />
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ghi chú cho quán
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Không hành, ít cay, thêm rau..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows={2}
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng cộng</span>
          <span className="text-xl font-bold text-amber-600">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/table/${tableId}/menu`)}
          className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          ← Thêm món
        </button>
        <button
          onClick={handleOrder}
          disabled={submitting}
          className="flex-1 bg-stone-900 text-amber-100 font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 border-b-4 border-amber-500"
        >
          {submitting ? "Đang đặt..." : "🌾 Đặt Món"}
        </button>
      </div>
    </div>
  );
}
