"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { buildVietQRUrl } from "@/lib/vietqr";

interface VietQRPaymentProps {
  amount: number;
  orderNumber: string;
}

export default function VietQRPayment({
  amount,
  orderNumber,
}: VietQRPaymentProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const qrUrl = buildVietQRUrl({ amount, orderNumber });
  const accountNo = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NO || "";
  const transferContent = `Thanh toan ${orderNumber}`;

  const downloadQR = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-${orderNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-amber-200">
      <h3 className="text-lg font-bold mb-1 text-stone-900">
        💳 Thanh toán chuyển khoản
      </h3>
      <p className="text-gray-600 text-xs mb-4">
        Quét mã QR bằng app ngân hàng để chuyển khoản
      </p>

      <div className="flex justify-center mb-4">
        <img
          src={qrUrl}
          alt="QR Thanh toán"
          className="w-60 h-auto rounded-lg border-2 border-amber-300 shadow-md"
        />
      </div>

      <div className="bg-amber-50 rounded-lg p-3 space-y-2 text-sm border border-amber-200 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số tiền:</span>
          <span className="font-bold text-amber-700 text-base">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-gray-600 shrink-0">Số TK:</span>
          <button
            onClick={() => copy(accountNo, "acc")}
            className="font-mono font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span className="truncate">{accountNo}</span>
            <span className="shrink-0">{copied === "acc" ? "✓" : "📋"}</span>
          </button>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-gray-600 shrink-0">Nội dung:</span>
          <button
            onClick={() => copy(transferContent, "ct")}
            className="font-mono font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span className="truncate">{orderNumber}</span>
            <span className="shrink-0">{copied === "ct" ? "✓" : "📋"}</span>
          </button>
        </div>
      </div>

      <button
        onClick={downloadQR}
        className="w-full bg-stone-900 text-amber-100 font-bold py-3 px-4 rounded-lg hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        📥 Lưu ảnh QR vào máy
      </button>
    </div>
  );
}
