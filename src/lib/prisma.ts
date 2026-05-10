import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const useTurso =
  !!process.env.TURSO_DATABASE_URL &&
  process.env.TURSO_DATABASE_URL.startsWith("libsql://");

const prismaClient = useTurso
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  : new PrismaClient();

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
