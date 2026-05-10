import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.CLOUDINARY_FOLDER || "banh-canh-menu";

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(buffer)]));
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data2 = (await res.json()) as { secure_url: string };
  return data2.secure_url;
}

async function uploadToLocal(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "images", "menu");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/images/menu/${fileName}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Chưa chọn file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF)" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File quá lớn (tối đa 5MB)" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME;
    let url: string;

    if (useCloudinary) {
      url = await uploadToCloudinary(buffer);
    } else {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      url = await uploadToLocal(buffer, fileName);
    }

    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi upload" },
      { status: 500 }
    );
  }
}
