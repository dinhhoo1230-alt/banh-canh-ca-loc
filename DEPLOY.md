# Hướng dẫn Deploy lên Vercel + Turso + Cloudinary (miễn phí)

App này được cấu hình để chạy production với:
- **Vercel** — hosting Next.js
- **Turso** — database (libSQL, tương thích SQLite)
- **Cloudinary** — lưu ảnh menu

Tổng thời gian setup: ~30 phút. Tổng chi phí: **0đ/tháng** với free tier.

---

## Bước 1: Tạo database Turso

1. Vào https://turso.tech → đăng ký bằng GitHub
2. Tạo database mới:
   - Click **Create Database**
   - Name: `banh-canh-ca-loc`
   - Region: `Singapore (sin)` (gần Việt Nam nhất)
   - Click **Create**
3. Lưu lại 2 thông tin sau (sẽ dùng ở Bước 5):
   - **Database URL**: dạng `libsql://banh-canh-ca-loc-username.turso.io` (hiện ngay sau khi tạo)
   - **Auth Token**: tab **Tokens** → **Create Token** → copy chuỗi `ey...` rất dài

---

## Bước 2: Tạo Cloudinary

1. Vào https://cloudinary.com → đăng ký miễn phí
2. Sau khi vào dashboard, ở phần **Account Details** lấy:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click "Reveal" để xem)

---

## Bước 3: Push code lên GitHub

Mở PowerShell tại thư mục dự án:

```powershell
git init
git add .
git commit -m "Initial commit"
```

1. Vào https://github.com/new → tạo repo mới `banh-canh-ca-loc` (Private hoặc Public đều được)
2. Copy các lệnh GitHub gợi ý sau khi tạo, ví dụ:

```powershell
git remote add origin https://github.com/<username>/banh-canh-ca-loc.git
git branch -M main
git push -u origin main
```

---

## Bước 4: Push schema lên Turso

Trước khi deploy Vercel, cần tạo bảng trong Turso. Cách dễ nhất: chỉnh tạm `.env` rồi chạy `prisma db push`.

1. Mở `.env` (file hiện có ở local), tạm thời đổi `DATABASE_URL`:

```env
# Thay file SQLite local bằng Turso URL (cần ?authToken=)
DATABASE_URL="libsql://banh-canh-ca-loc-USERNAME.turso.io?authToken=ey..."
```

> Lưu ý: chèn token vào sau `?authToken=`.

2. Chạy:

```powershell
npx prisma db push
```

3. Seed dữ liệu mẫu (12 món, 3 danh mục, 10 bàn):

```powershell
npx tsx prisma/seed.ts
```

4. **Đổi `.env` lại `file:./dev.db`** để local dev tiếp tục dùng SQLite (không bắt buộc nhưng nên).

---

## Bước 5: Deploy Vercel

1. Vào https://vercel.com → đăng nhập bằng GitHub
2. Click **Add New → Project** → chọn repo `banh-canh-ca-loc` → **Import**
3. Trong màn hình config, mở **Environment Variables**, thêm các biến sau:

| Tên biến | Giá trị |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://banh-canh-ca-loc-USERNAME.turso.io` (KHÔNG có `?authToken=`) |
| `TURSO_AUTH_TOKEN` | chuỗi `ey...` từ Turso |
| `NEXTAUTH_SECRET` | random 32 ký tự, vd: chạy `openssl rand -base64 32` hoặc tự chế chuỗi dài |
| `NEXTAUTH_URL` | bỏ trống cho lần đầu — sẽ điền sau khi có URL Vercel |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | mật khẩu admin của bạn |
| `NEXT_PUBLIC_VIETQR_BANK_ID` | mã ngân hàng (xem https://vietqr.io/danh-sach-bank) |
| `NEXT_PUBLIC_VIETQR_ACCOUNT_NO` | số tài khoản |
| `NEXT_PUBLIC_VIETQR_ACCOUNT_NAME` | tên chủ TK (in hoa, không dấu) |
| `NEXT_PUBLIC_VIETQR_TEMPLATE` | `compact2` |
| `NEXT_PUBLIC_APP_NAME` | `Bánh Canh Cá Lóc` |
| `NEXT_PUBLIC_APP_URL` | bỏ trống lần đầu — sẽ điền sau |
| `CLOUDINARY_CLOUD_NAME` | từ Bước 2 |
| `CLOUDINARY_API_KEY` | từ Bước 2 |
| `CLOUDINARY_API_SECRET` | từ Bước 2 |
| `CLOUDINARY_FOLDER` | `banh-canh-menu` |

4. Click **Deploy**. Đợi ~2 phút.

5. Sau khi deploy xong, Vercel cấp URL dạng `https://banh-canh-ca-loc-xxx.vercel.app`. Copy URL này.

6. Quay lại **Settings → Environment Variables**, thêm/sửa:
   - `NEXTAUTH_URL` = `https://banh-canh-ca-loc-xxx.vercel.app`
   - `NEXT_PUBLIC_APP_URL` = `https://banh-canh-ca-loc-xxx.vercel.app`

7. Vào tab **Deployments** → click **⋯** ở deployment mới nhất → **Redeploy** để apply env mới.

---

## Bước 6: Test live

1. Mở `https://your-url.vercel.app/table/1` — phải thấy trang chào bàn 1
2. Mở `https://your-url.vercel.app/admin` — đăng nhập với `ADMIN_USERNAME`/`ADMIN_PASSWORD`
3. Vào **Bàn** → in QR — link sẽ trỏ về `https://your-url.vercel.app/table/N`
4. Đặt thử 1 đơn để verify VietQR hiện đúng STK

---

## Bước 7: In QR và dán bàn

QR code mới giờ trỏ về URL Vercel public, nên khách quét **bằng 4G hoặc bất kỳ wifi nào** đều mở được.

---

## Cập nhật code sau này

Mỗi khi bạn `git push` lên `main`, Vercel **tự động deploy** lại — không cần làm gì thêm.

```powershell
git add .
git commit -m "<mô tả thay đổi>"
git push
```

---

## Troubleshooting

- **Build fail "Prisma generate failed"**: kiểm tra biến `TURSO_DATABASE_URL` có được set đúng không
- **Login admin không vào được**: kiểm tra `NEXTAUTH_SECRET` và `NEXTAUTH_URL` chính xác
- **Upload ảnh lỗi**: kiểm tra 4 biến `CLOUDINARY_*` đầy đủ và `API_SECRET` không bị rò rỉ space
- **QR scan ra 404**: chắc chắn `NEXT_PUBLIC_APP_URL` đã update sau redeploy
