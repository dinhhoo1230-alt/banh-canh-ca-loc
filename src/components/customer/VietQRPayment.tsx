"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { buildVietQRUrl } from "@/lib/vietqr";

interface VietQRPaymentProps {
  amount: number;
  orderNumber: string;
}

const BANK_APPS = [
  { name: "Vietcombank", short: "VCB", scheme: "vietcombank://", color: "bg-green-700" },
  { name: "MB Bank", short: "MB", scheme: "mbbank://", color: "bg-pink-700" },
  { name: "Techcombank", short: "TCB", scheme: "tcb://", color: "bg-red-600" },
  { name: "BIDV", short: "BIDV", scheme: "bidv://", color: "bg-teal-600" },
  { name: "Agribank", short: "AGR", scheme: "agribankemb://", color: "bg-rose-700" },
  { name: "VietinBank", short: "CTG", scheme: "ipay://", color: "bg-blue-700" },
  { name: "VPBank", short: "VPB", scheme: "vpbankneo://", color: "bg-emerald-700" },
  { name: "ACB", short: "ACB", scheme: "acb://", color: "bg-sky-700" },
  { name: "TPBank", short: "TPB", scheme: "tpb://", color: "bg-purple-700" },
  { name: "Sacombank", short: "STB", scheme: "sacombank://", color: "bg-amber-700" },
  { name: "Momo", short: "MoMo", scheme: "momo://", color: "bg-fuchsia-700" },
  { name: "ZaloPay", short: "ZLP", scheme: "zalopay://", color: "bg-indigo-700" },
];

export default function VietQRPayment({
  amount,
  orderNumber,
}: VietQRPaymentProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showAllBanks, setShowAllBanks] = useState(false);

  const qrUrl = buildVietQRUrl({ amount, orderNumber });
  const accountNo = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NO || "";
  const transferContent = `Thanh toan ${orderNumber}`;

  const visibleBanks = showAllBanks ? BANK_APPS : BANK_APPS.slice(0, 8);

  const openBankApp = (scheme: string) => {
    window.location.href = scheme;
  };

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
        Quét mã QR hoặc mở app ngân hàng để thanh toán
      </p>

      <div className="flex justify-center mb-4">
        <img
          src={qrUrl}
          alt="QR Thanh toán"
          className="w-60 h-auto rounded-lg border-2 border-amber-300 shadow-md"
        />
      </div>

      <div className="bg-amber-50 rounded-lg p-3 space-y-2 text-sm mb-4 border border-amber-200">
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
            className="font-mono font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1 text-right"
          >
            <span className="truncate">{accountNo}</span>
            <span className="shrink-0">{copied === "acc" ? "✓" : "📋"}</span>
          </button>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-gray-600 shrink-0">Nội dung:</span>
          <button
            onClick={() => copy(transferContent, "ct")}
            className="font-mono font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1 text-right"
          >
            <span className="truncate">{orderNumber}</span>
            <span className="shrink-0">{copied === "ct" ? "✓" : "📋"}</span>
          </button>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-amber-200 pt-4 mb-3">
        <p className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-1">
          📱 Mở app ngân hàng của bạn
        </p>
        <div className="grid grid-cols-4 gap-2">
          {visibleBanks.map((bank) => (
            <button
              key={bank.short}
              onClick={() => openBankApp(bank.scheme)}
              className={`${bank.color} text-white text-xs font-bold py-3 px-1 rounded-lg hover:opacity-85 active:scale-95 transition-all shadow-sm`}
              title={bank.name}
            >
              {bank.short}
            </button>
          ))}
        </div>
        {!showAllBanks && BANK_APPS.length > 8 && (
          <button
            onClick={() => setShowAllBanks(true)}
            className="w-full text-xs text-amber-700 font-semibold mt-2 hover:underline"
          >
            + Xem thêm app khác
          </button>
        )}
      </div>

      <button
        onClick={downloadQR}
        className="w-full bg-stone-900 text-amber-100 font-bold py-2.5 px-4 rounded-lg hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
      >
        ⬇️ Lưu ảnh QR vào máy
      </button>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-stone-700 leading-relaxed">
        <p className="font-bold mb-1">💡 Mẹo thanh toán nhanh:</p>
        <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
          <li>Bấm icon ngân hàng ở trên → app sẽ tự mở</li>
          <li>Trong app chọn <b>&quot;Quét QR&quot;</b> rồi quét lại màn này</li>
          <li>Hoặc bấm <b>&quot;Lưu ảnh QR&quot;</b> → vào app chọn <b>&quot;Đọc QR từ ảnh&quot;</b></li>
        </ol>
      </div>
    </div>
  );
}
