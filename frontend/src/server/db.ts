import { env } from '@/env.mjs';
import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prismaMethod = {
  sql: Prisma.sql,
};

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
