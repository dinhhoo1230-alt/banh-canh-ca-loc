import CartHeaderButton from "@/components/customer/CartHeaderButton";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-stone-900 text-amber-100 px-4 py-4 sticky top-0 z-50 shadow-lg border-b-4 border-amber-400">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="w-10" />
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div className="text-center">
              <h1 className="font-bold text-lg leading-tight tracking-wide">
                Bánh Canh Cá Lóc
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
                Hương Vị Đồng Quê
              </p>
            </div>
            <span className="text-2xl">🌾</span>
          </div>
          <CartHeaderButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto pb-20">{children}</main>
    </div>
  );
}
