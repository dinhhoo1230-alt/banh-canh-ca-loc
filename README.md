# Bánh Canh Cá Lóc — Ứng dụng Đặt Món Dine-in

Ứng dụng web đặt món tại bàn cho quán **Bánh Canh Cá Lóc**. Khách quét QR tại bàn → xem menu → đặt món → thanh toán bằng QR chuyển khoản. Có trang admin quản lý đơn, menu, bàn, doanh thu.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** (theme đen-vàng đồng quê)
- **Prisma** + **SQLite** (local) / **Turso libSQL** (production)
- **Zustand** (giỏ hàng, persist localStorage)
- **NextAuth.js** (admin login)
- **Cloudinary** (lưu ảnh menu khi production)
- **VietQR** (mã QR thanh toán chuyển khoản)

## Chạy local

```bash
npm install
cp .env.example .env       # rồi điền thông tin vào .env
npx prisma db push          # tạo bảng
npx tsx prisma/seed.ts      # nạp dữ liệu mẫu
npm run dev
```

Mở http://localhost:3000/table/1 — trang khách
Mở http://localhost:3000/admin — trang admin (đăng nhập bằng ADMIN_USERNAME/PASSWORD trong .env)

## Deploy lên cloud

Xem hướng dẫn chi tiết tại [DEPLOY.md](./DEPLOY.md).

Tóm tắt: deploy lên **Vercel** (hosting) + **Turso** (database) + **Cloudinary** (ảnh) — tất cả free tier, ~0đ/tháng.

## Cấu trúc

```
src/
├── app/
│   ├── (customer)/    # Giao diện khách (mobile-first)
│   ├── (admin)/       # Giao diện admin (desktop + mobile drawer)
│   └── api/           # API routes
├── components/
│   ├── customer/
│   ├── admin/
│   └── ui/
├── lib/               # prisma, auth, utils, vietqr
├── stores/            # cartStore (Zustand)
└── types/

prisma/
├── schema.prisma      # 5 models: DiningTable, Category, MenuItem, Order, OrderItem
└── seed.ts            # 12 món, 3 danh mục, 10 bàn
```
