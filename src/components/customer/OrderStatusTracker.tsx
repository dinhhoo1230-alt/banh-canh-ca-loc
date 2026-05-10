"use client";

import type { OrderStatus } from "@/types";

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "pending", label: "Chờ xác nhận", icon: "⏳" },
  { status: "confirmed", label: "Đã xác nhận", icon: "✓" },
  { status: "preparing", label: "Đang chế biến", icon: "👨‍🍳" },
  { status: "ready", label: "Sẵn sàng", icon: "🔔" },
  { status: "completed", label: "Hoàn thành", icon: "✅" },
];

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTracker({
  currentStatus,
}: OrderStatusTrackerProps) {
  if (currentStatus === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <span className="text-2xl">❌</span>
        <p className="font-semibold text-red-700 mt-2">Đơn hàng đã bị hủy</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="space-y-3">
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.status} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                isCompleted
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-400"
              } ${isCurrent ? "ring-2 ring-amber-300 ring-offset-2" : ""}`}
            >
              {step.icon}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium text-sm ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {isCurrent && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                Hiện tại
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
