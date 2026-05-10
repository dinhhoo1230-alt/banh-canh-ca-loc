"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id: number;
  name: string;
}

function EditMenuItemContent() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then((r) => r.json()),
      fetch(`/api/menu/${itemId}`).then((r) => r.json()),
    ]).then(([cats, item]) => {
      setCategories(cats.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })));
      setName(item.name);
      setDescription(item.description || "");
      setPrice(item.price.toString());
      setCategoryId(item.categoryId.toString());
      setImage(item.image || null);
      setIsAvailable(item.isAvailable);
      setLoading(false);
    });
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await fetch(`/api/menu/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        image: image || null,
        isAvailable,
      }),
    });

    router.push("/admin/menu");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Sửa Món</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Ảnh món ăn</label>
          <ImageUpload value={image} onChange={setImage} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên món</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giá (VND)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="available" className="text-sm">
            Còn hàng
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/menu")}
            className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditMenuItemPage() {
  return (
    <SessionProvider>
      <AdminShell>
        <EditMenuItemContent />
      </AdminShell>
    </SessionProvider>
  );
}
