interface VietQRParams {
  amount: number;
  orderNumber: string;
}

export function buildVietQRUrl({ amount, orderNumber }: VietQRParams): string {
  const bankId = process.env.NEXT_PUBLIC_VIETQR_BANK_ID || "970415";
  const accountNo = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NO || "1234567890";
  const accountName =
    process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NAME || "NGUYEN VAN A";
  const template = process.env.NEXT_PUBLIC_VIETQR_TEMPLATE || "compact2";

  const params = new URLSearchParams({
    amount: amount.toString(),
    addInfo: `Thanh toan ${orderNumber}`,
    accountName,
  });

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?${params.toString()}`;
}
