// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

// This will ensure we reuse the Prisma client in development (Next.js hot reload issue)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma client if not already initialized
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error'], // Log queries in development for debugging
  });

// Cache the Prisma client instance in non-production environments (e.g., during development)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
