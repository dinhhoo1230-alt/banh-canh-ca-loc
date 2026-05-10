"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import SessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";

interface Table {
  id: number;
  number: number;
  name: string | null;
  isActive: boolean;
}

function TablesContent() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const loadTables = async () => {
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTables();
  }, []);

  const nextSuggestedNumber =
    tables.length === 0 ? 1 : Math.max(...tables.map((t) => t.number)) + 1;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: parseInt(newNumber),
        name: newName || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Lỗi khi thêm bàn");
      return;
    }

    setNewNumber("");
    setNewName("");
    setShowAddForm(false);
    loadTables();
  };

  const handleDelete = async (id: number, number: number) => {
    if (!confirm(`Xóa Bàn ${number}? QR code sẽ ngừng hoạt động.`)) return;
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    loadTables();
  };

  const printQR = (tableNumber: number, tableName: string | null) => {
    const svgEl = document.getElementById(`qr-${tableNumber}`);
    if (!svgEl) return;

    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.setAttribute("width", "320");
    clone.setAttribute("height", "320");
    const svgString = new XMLSerializer().serializeToString(clone);
    const url = `${baseUrl}/table/${tableNumber}`;
    const showSubtitle =
      tableName &&
      tableName.trim() !== `Bàn ${tableNumber}` &&
      tableName.trim() !== `${tableNumber}`;

    let iframe = document.getElementById(
      "qr-print-iframe"
    ) as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "qr-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>QR Bàn ${tableNumber}</title>
  <style>
    @page { size: 100mm 100mm; margin: 5mm; }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    body {
      margin: 0;
      padding: 0;
      font-family: Georgia, serif;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fffbeb;
      color: #1c1917;
    }
    .card {
      border: 2px solid #1c1917;
      border-radius: 12px;
      padding: 10px 12px;
      text-align: center;
      background: white;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .header { width: 100%; }
    .brand {
      font-size: 9px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #b45309;
      margin: 0 0 2px 0;
    }
    .name { font-size: 13px; font-weight: bold; margin: 0 0 4px 0; }
    .table-no { font-size: 22px; font-weight: bold; margin: 0; line-height: 1.1; }
    .subtitle { font-style: italic; color: #78716c; font-size: 10px; margin: 2px 0 0 0; }
    .qr { display: flex; justify-content: center; align-items: center; flex: 1; padding: 4px 0; }
    .qr svg { width: 100%; height: 100%; max-width: 220px; max-height: 220px; }
    .foot { width: 100%; }
    .footer { font-size: 10px; color: #57534e; margin: 0; }
    .url { font-size: 7px; color: #a8a29e; margin: 2px 0 0 0; word-break: break-all; }
    @media print {
      body { background: white; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <p class="brand">🌾 Hương Vị Đồng Quê 🌾</p>
      <p class="name">Bánh Canh Cá Lóc Phước Lãnh</p>
      <p class="table-no">Bàn ${tableNumber}</p>
      ${showSubtitle ? `<p class="subtitle">${tableName}</p>` : ""}
    </div>
    <div class="qr">${svgString}</div>
    <div class="foot">
      <p class="footer">Quét mã để đặt món</p>
      <p class="url">${url}</p>
    </div>
  </div>
</body>
</html>`);
    doc.close();

    setTimeout(() => {
      iframe!.contentWindow?.focus();
      iframe!.contentWindow?.print();
    }, 300);
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
        <h1 className="text-xl md:text-2xl font-bold">Quản Lý Bàn & QR Code</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setError("");
            if (!showAddForm) setNewNumber(String(nextSuggestedNumber));
          }}
          className="bg-stone-900 text-amber-100 font-medium px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors border-b-4 border-amber-500 whitespace-nowrap text-sm"
        >
          {showAddForm ? "Đóng" : "+ Thêm Bàn"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 mb-6 max-w-lg"
        >
          <h2 className="font-bold mb-4">Thêm Bàn Mới</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Số bàn <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder={`Gợi ý: ${nextSuggestedNumber}`}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên bàn (tùy chọn)
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Bàn VIP, Sân vườn..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-3 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-amber-500 text-stone-900 font-medium py-2.5 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu Bàn"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 text-center relative group"
          >
            <button
              onClick={() => handleDelete(table.id, table.number)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 text-red-500 text-sm opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-opacity"
              title="Xóa bàn"
            >
              ✕
            </button>
            <p className="font-bold text-lg mb-1">Bàn {table.number}</p>
            {table.name && (
              <p className="text-xs text-gray-500 mb-2 italic">{table.name}</p>
            )}
            <div className="flex justify-center mb-3">
              <QRCodeSVG
                id={`qr-${table.number}`}
                value={`${baseUrl}/table/${table.number}`}
                size={120}
                level="M"
              />
            </div>
            <p className="text-xs text-gray-400 mb-3 truncate">
              {baseUrl}/table/{table.number}
            </p>
            <button
              onClick={() => printQR(table.number, table.name)}
              className="w-full bg-gray-100 text-gray-700 text-sm py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              🖨️ In QR
            </button>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-amber-300">
          <p className="text-gray-500">Chưa có bàn nào. Hãy thêm bàn đầu tiên.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminTablesPage() {
  return (
    <SessionProvider>
      <AdminShell>
        <TablesContent />
      </AdminShell>
    </SessionProvider>
  );
}
