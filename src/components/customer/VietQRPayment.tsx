"use client";

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
  const qrUrl = buildVietQRUrl({ amount, orderNumber });

  return (
    <div className="bg-white rounded-xl p-6 text-center">
      <h3 className="text-lg font-bold mb-2">Thanh toán chuyển khoản</h3>
      <p className="text-gray-600 text-sm mb-4">
        Quét mã QR bên dưới để chuyển khoản
      </p>
      <div className="flex justify-center mb-4">
        <img
          src={qrUrl}
          alt="QR Thanh toán"
          className="w-64 h-auto rounded-lg border border-gray-200"
        />
      </div>
      <div className="bg-amber-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Số tiền:</span>
          <span className="font-bold text-amber-600">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nội dung CK:</span>
          <span className="font-mono font-bold">{orderNumber}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Vui lòng ghi đúng nội dung chuyển khoản để được xác nhận nhanh nhất
      </p>
    </div>
  );
}
