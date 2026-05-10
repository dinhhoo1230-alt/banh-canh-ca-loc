"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";

export default function TableLandingPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = parseInt(params.tableId as string);
  const setTableId = useCartStore((s) => s.setTableId);

  useEffect(() => {
    if (tableId) setTableId(tableId);
  }, [tableId, setTableId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border-2 border-amber-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-stone-900" />

        <span className="text-5xl block mb-2">🌾🍜🌾</span>
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 mb-1">
          Quán Quê
        </p>
        <h2 className="text-2xl font-bold mb-4 text-stone-900">Chào Mừng Quý Khách</h2>

        <div className="bg-amber-50 rounded-xl px-6 py-5 mb-6 border border-dashed border-amber-400">
          <p className="text-stone-600 text-sm italic">Bạn đang ngồi tại</p>
          <p className="text-4xl font-bold text-stone-900 mt-1">
            Bàn <span className="text-amber-600">{tableId}</span>
          </p>
        </div>

        <button
          onClick={() => router.push(`/table/${tableId}/menu`)}
          className="w-full bg-stone-900 text-amber-100 font-bold py-3 px-6 rounded-xl text-lg hover:bg-stone-800 transition-colors shadow-md border-b-4 border-amber-500"
        >
          🌾 Xem Thực Đơn
        </button>

        <p className="text-xs text-stone-500 italic mt-4">
          &ldquo;Hương đồng cỏ nội, đậm đà tình quê&rdquo;
        </p>
      </div>
    </div>
  );
}
