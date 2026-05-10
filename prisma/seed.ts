import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.diningTable.deleteMany();

  const banhCanh = await prisma.category.create({
    data: { name: "Bánh Canh", slug: "banh-canh", sortOrder: 1 },
  });

  const monAnKem = await prisma.category.create({
    data: { name: "Món Ăn Kèm", slug: "mon-an-kem", sortOrder: 2 },
  });

  const nuocUong = await prisma.category.create({
    data: { name: "Nước Uống", slug: "nuoc-uong", sortOrder: 3 },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Bánh canh cá lóc thường",
        description: "Bánh canh cá lóc tươi, nước dùng đậm đà",
        price: 35000,
        image: "/images/menu/banh-canh-thuong.jpg",
        categoryId: banhCanh.id,
        sortOrder: 1,
      },
      {
        name: "Bánh canh cá lóc đặc biệt",
        description: "Bánh canh cá lóc với nhiều cá hơn, thêm topping",
        price: 45000,
        image: "/images/menu/banh-canh-dac-biet.jpg",
        categoryId: banhCanh.id,
        sortOrder: 2,
      },
      {
        name: "Bánh canh cá lóc + chả cá",
        description: "Bánh canh cá lóc kèm chả cá chiên giòn",
        price: 50000,
        image: "/images/menu/banh-canh-cha-ca.jpg",
        categoryId: banhCanh.id,
        sortOrder: 3,
      },
      {
        name: "Bánh canh cá lóc + giò heo",
        description: "Bánh canh cá lóc kèm giò heo hầm mềm",
        price: 55000,
        image: "/images/menu/banh-canh-gio-heo.jpg",
        categoryId: banhCanh.id,
        sortOrder: 4,
      },
      {
        name: "Chả cá chiên",
        description: "Chả cá chiên giòn thơm ngon",
        price: 15000,
        image: "/images/menu/cha-ca-chien.jpg",
        categoryId: monAnKem.id,
        sortOrder: 1,
      },
      {
        name: "Chả cuốn",
        description: "Chả cuốn tươi với rau sống",
        price: 20000,
        image: "/images/menu/cha-cuon.jpg",
        categoryId: monAnKem.id,
        sortOrder: 2,
      },
      {
        name: "Rau sống",
        description: "Đĩa rau sống tươi ngon",
        price: 5000,
        image: "/images/menu/rau-song.jpg",
        categoryId: monAnKem.id,
        sortOrder: 3,
      },
      {
        name: "Trứng vịt lộn",
        description: "Trứng vịt lộn luộc nóng hổi",
        price: 12000,
        image: "/images/menu/trung-vit-lon.jpg",
        categoryId: monAnKem.id,
        sortOrder: 4,
      },
      {
        name: "Trà đá",
        description: "Trà đá mát lạnh",
        price: 3000,
        image: "/images/menu/tra-da.jpg",
        categoryId: nuocUong.id,
        sortOrder: 1,
      },
      {
        name: "Nước ngọt (Coca/Pepsi)",
        description: "Lon nước ngọt có ga",
        price: 12000,
        image: "/images/menu/nuoc-ngot.jpg",
        categoryId: nuocUong.id,
        sortOrder: 2,
      },
      {
        name: "Nước suối",
        description: "Chai nước suối tinh khiết",
        price: 8000,
        image: "/images/menu/nuoc-suoi.jpg",
        categoryId: nuocUong.id,
        sortOrder: 3,
      },
      {
        name: "Trà chanh",
        description: "Trà chanh tươi mát",
        price: 15000,
        image: "/images/menu/tra-chanh.jpg",
        categoryId: nuocUong.id,
        sortOrder: 4,
      },
    ],
  });

  for (let i = 1; i <= 10; i++) {
    await prisma.diningTable.create({
      data: { number: i, name: `Bàn ${i}` },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
