"use client";

import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

interface MenuItemCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
}

export default function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
}: MenuItemCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.menuItemId === id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({ menuItemId: id, name, price, image });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden flex flex-row hover:shadow-md transition-shadow">
      <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-amber-50 flex-shrink-0 flex items-center justify-center border-r-2 border-dashed border-amber-300">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl">🌾</span>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm leading-tight">{name}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-amber-600 font-bold text-sm">
            {formatCurrency(price)}
          </span>
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-stone-900 text-amber-100 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-stone-800 transition-colors border border-amber-500"
            >
              + Thêm
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  quantity === 1
                    ? removeItem(id)
                    : updateQuantity(id, quantity - 1)
                }
                className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-sm font-bold"
              >
                -
              </button>
              <span className="w-5 text-center font-semibold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(id, quantity + 1)}
                className="w-7 h-7 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center text-sm font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
