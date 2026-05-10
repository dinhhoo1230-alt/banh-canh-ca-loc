import Image from "next/image";
import CartHeaderButton from "@/components/customer/CartHeaderButton";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-stone-900 text-amber-100 px-4 py-3 sticky top-0 z-50 shadow-lg border-b-4 border-amber-400">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-3">
          <div className="w-10" />
          <div className="flex items-center justify-center flex-1">
            <Image
              src="/images/logo.png"
              alt="Bánh Canh Cá Lóc Phước Lãnh"
              width={336}
              height={104}
              priority
              className="h-[70px] md:h-[84px] w-auto max-w-full object-contain"
            />
          </div>
          <CartHeaderButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto pb-20">{children}</main>
    </div>
  );
}
