"use client";

import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

interface CartItemProps {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function CartItem({
  menuItemId,
  name,
  price,
  quantity,
  image,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <div className="w-14 h-14 bg-amber-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🍜</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{name}</h4>
        <p className="text-amber-600 font-semibold text-sm">
          {formatCurrency(price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            quantity === 1
              ? removeItem(menuItemId)
              : updateQuantity(menuItemId, quantity - 1)
          }
          className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold"
        >
          -
        </button>
        <span className="w-5 text-center font-semibold text-sm">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(menuItemId, quantity + 1)}
          className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold"
        >
          +
        </button>
      </div>
      <div className="w-20 text-right">
        <span className="font-semibold text-sm">
          {formatCurrency(price * quantity)}
        </span>
      </div>
    </div>
  );
}
