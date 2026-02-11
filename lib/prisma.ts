import { PrismaClient } from "@prisma/client";

declare global {
  interface BigInt {
    toJSON(): number;
  }

  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient();

BigInt.prototype.toJSON = function (): number {
  return Number(this);
};

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
