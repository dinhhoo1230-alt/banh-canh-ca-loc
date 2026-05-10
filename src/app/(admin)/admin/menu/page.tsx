"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  category: { name: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  menuItems: MenuItem[];
}

function MenuContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = () => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleAvailability = async (id: number, isAvailable: boolean) => {
    await fetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
    fetchMenu();
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa món này?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h1 className="text-xl md:text-2xl font-bold">Quản Lý Thực Đơn</h1>
        <Link
          href="/admin/menu/new"
          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors whitespace-nowrap"
        >
          + Thêm Món
        </Link>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-6">
          <h2 className="text-lg font-bold mb-3">{cat.name}</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed">
              <colgroup>
                <col />
                <col className="w-[140px]" />
                <col className="w-[140px]" />
                <col className="w-[110px]" />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Món ăn
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Giá
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cat.menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span>🍜</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-sm">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleAvailability(item.id, item.isAvailable)
                        }
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isAvailable ? "Còn hàng" : "Hết hàng"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/menu/${item.id}/edit`}
                          className="text-blue-500 text-xs hover:underline"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminMenuPage() {
  return (
    <SessionProvider>
      <AdminShell>
        <MenuContent />
      </AdminShell>
    </SessionProvider>
  );
}
