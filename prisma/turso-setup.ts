import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const TURSO_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN!;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error(
    "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN env variable"
  );
  process.exit(1);
}

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function pushSchema() {
  console.log("📦 Pushing schema to Turso...");
  const sqlPath = join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260509162020_init",
    "migration.sql"
  );
  const raw = readFileSync(sqlPath, "utf-8");

  // Strip comments and collapse blank lines
  const noComments = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  // Split on ; at end of line (handles both CREATE TABLE and CREATE INDEX)
  const statements = noComments
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      const firstLine = stmt.split("\n")[0].slice(0, 70);
      console.log("  ✓", firstLine);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log("  ⊙ skipped (already exists)");
      } else {
        console.error("  ✗ Failed:", msg);
        console.error("  Statement was:", stmt.slice(0, 200));
        throw e;
      }
    }
  }
  console.log("✅ Schema pushed\n");
}

async function seed() {
  console.log("🌱 Seeding data...");

  // Clear existing data (in dependency order)
  await client.execute("DELETE FROM OrderItem");
  await client.execute('DELETE FROM "Order"');
  await client.execute("DELETE FROM MenuItem");
  await client.execute("DELETE FROM Category");
  await client.execute("DELETE FROM DiningTable");

  const now = new Date().toISOString();

  // Categories
  const categories = [
    { name: "Bánh Canh", slug: "banh-canh", sortOrder: 1 },
    { name: "Món Ăn Kèm", slug: "mon-an-kem", sortOrder: 2 },
    { name: "Nước Uống", slug: "nuoc-uong", sortOrder: 3 },
  ];
  const catIds: Record<string, number> = {};
  for (const c of categories) {
    const r = await client.execute({
      sql: 'INSERT INTO Category (name, slug, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      args: [c.name, c.slug, c.sortOrder, now, now],
    });
    catIds[c.slug] = Number(r.lastInsertRowid);
  }
  console.log("  ✓ 3 categories");

  // Menu items
  const items = [
    { name: "Bánh canh cá lóc thường", description: "Bánh canh cá lóc tươi, nước dùng đậm đà", price: 35000, image: null, cat: "banh-canh", sortOrder: 1 },
    { name: "Bánh canh cá lóc đặc biệt", description: "Bánh canh cá lóc với nhiều cá hơn, thêm topping", price: 45000, image: null, cat: "banh-canh", sortOrder: 2 },
    { name: "Bánh canh cá lóc + chả cá", description: "Bánh canh cá lóc kèm chả cá chiên giòn", price: 50000, image: null, cat: "banh-canh", sortOrder: 3 },
    { name: "Bánh canh cá lóc + giò heo", description: "Bánh canh cá lóc kèm giò heo hầm mềm", price: 55000, image: null, cat: "banh-canh", sortOrder: 4 },
    { name: "Chả cá chiên", description: "Chả cá chiên giòn thơm ngon", price: 15000, image: null, cat: "mon-an-kem", sortOrder: 1 },
    { name: "Chả cuốn", description: "Chả cuốn tươi với rau sống", price: 20000, image: null, cat: "mon-an-kem", sortOrder: 2 },
    { name: "Rau sống", description: "Đĩa rau sống tươi ngon", price: 5000, image: null, cat: "mon-an-kem", sortOrder: 3 },
    { name: "Trứng vịt lộn", description: "Trứng vịt lộn luộc nóng hổi", price: 12000, image: null, cat: "mon-an-kem", sortOrder: 4 },
    { name: "Trà đá", description: "Trà đá mát lạnh", price: 3000, image: null, cat: "nuoc-uong", sortOrder: 1 },
    { name: "Nước ngọt (Coca/Pepsi)", description: "Lon nước ngọt có ga", price: 12000, image: null, cat: "nuoc-uong", sortOrder: 2 },
    { name: "Nước suối", description: "Chai nước suối tinh khiết", price: 8000, image: null, cat: "nuoc-uong", sortOrder: 3 },
    { name: "Trà chanh", description: "Trà chanh tươi mát", price: 15000, image: null, cat: "nuoc-uong", sortOrder: 4 },
  ];

  for (const it of items) {
    await client.execute({
      sql: 'INSERT INTO MenuItem (name, description, price, image, categoryId, isAvailable, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)',
      args: [it.name, it.description, it.price, it.image, catIds[it.cat], it.sortOrder, now, now],
    });
  }
  console.log(`  ✓ ${items.length} menu items`);

  // Tables
  for (let i = 1; i <= 10; i++) {
    await client.execute({
      sql: 'INSERT INTO DiningTable (number, name, isActive, createdAt, updatedAt) VALUES (?, ?, 1, ?, ?)',
      args: [i, `Bàn ${i}`, now, now],
    });
  }
  console.log("  ✓ 10 tables");

  console.log("✅ Seed completed\n");
}

async function main() {
  await pushSchema();
  await seed();
  console.log("🎉 Turso database is ready!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
