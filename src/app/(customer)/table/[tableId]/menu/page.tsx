"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuItemCard from "@/components/customer/MenuItemCard";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  menuItems: MenuItem[];
}

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const filteredCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.slug === activeCategory);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">🌾 Thực Đơn</h2>
          <p className="text-[10px] uppercase tracking-widest text-amber-700">
            Hương Vị Đồng Quê
          </p>
        </div>
        <span className="text-sm text-amber-100 bg-stone-900 px-3 py-1 rounded-full border border-amber-500">
          Bàn {tableId}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === "all"
              ? "bg-stone-900 text-amber-100 border border-amber-500"
              : "bg-white text-stone-700 border border-amber-200"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.slug
                ? "bg-stone-900 text-amber-100 border border-amber-500"
                : "bg-white text-stone-700 border border-amber-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <div key={cat.id}>
            <h3 className="text-lg font-bold mb-3 text-stone-900 border-l-4 border-amber-500 pl-2">
              {cat.name}
            </h3>
            <div className="space-y-3">
              {cat.menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-amber-500 p-4 shadow-lg z-50">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => router.push(`/table/${tableId}/cart`)}
              className="w-full bg-stone-900 text-amber-100 font-bold py-3 px-6 rounded-xl flex items-center justify-between hover:bg-stone-800 transition-colors border-b-4 border-amber-500"
            >
              <span className="flex items-center gap-2">
                <span className="bg-amber-500 text-stone-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
                Xem giỏ hàng
              </span>
              <span>{formatCurrency(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
