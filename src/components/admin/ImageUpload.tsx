"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Lỗi upload");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
          {value ? (
            <img
              src={value}
              alt="Ảnh món ăn"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl text-gray-300">🍜</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-block px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              uploading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {uploading ? "Đang tải lên..." : value ? "Đổi ảnh" : "Chọn ảnh"}
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 text-sm text-red-500 hover:underline"
            >
              Xóa ảnh
            </button>
          )}
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, WebP, GIF - Tối đa 5MB
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
