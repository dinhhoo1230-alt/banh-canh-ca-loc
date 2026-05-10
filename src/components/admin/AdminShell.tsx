"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="md:flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="md:hidden bg-stone-900 text-amber-100 px-4 py-3 sticky top-0 z-30 flex items-center justify-between border-b-4 border-amber-500">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl leading-none"
          aria-label="Mở menu"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <span className="font-bold">Bánh Canh Cá Lóc</span>
        </div>
        <div className="w-7" />
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
