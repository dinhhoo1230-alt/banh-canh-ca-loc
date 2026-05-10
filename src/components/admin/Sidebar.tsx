"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "📋" },
  { href: "/admin/menu", label: "Thực đơn", icon: "🍜" },
  { href: "/admin/tables", label: "Bàn", icon: "🪑" },
  { href: "/admin/revenue", label: "Doanh thu", icon: "💰" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Đóng menu"
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
      <aside
        className={cn(
          "w-64 bg-stone-900 text-amber-100 p-4 flex flex-col border-r-4 border-amber-500",
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:static md:translate-x-0 md:min-h-screen",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-8 px-2 pb-4 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">Bánh Canh Cá Lóc</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-400">
                Quán Quê
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-amber-100 text-xl leading-none p-1"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-500 text-stone-900"
                    : "text-amber-100/70 hover:bg-stone-800 hover:text-amber-100"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-amber-500/30 pt-4 mt-4">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-100/70 hover:bg-stone-800 hover:text-amber-100 transition-colors"
          >
            <span className="text-lg">🚪</span>
            Đăng xuất
          </Link>
        </div>
      </aside>
    </>
  );
}
