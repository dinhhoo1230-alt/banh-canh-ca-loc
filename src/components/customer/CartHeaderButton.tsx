"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";

export default function CartHeaderButton() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const tableId = params.tableId as string | undefined;
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !tableId) return <div className="w-10" />;
  if (pathname?.endsWith("/cart")) return <div className="w-10" />;

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={() => router.push(`/table/${tableId}/cart`)}
      className="relative bg-amber-500 text-stone-900 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md hover:bg-amber-400 transition-colors"
      aria-label="Xem giỏ hàng"
    >
      🛒
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-stone-900 text-amber-100 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-500">
          {count}
        </span>
      )}
    </button>
  );
}
