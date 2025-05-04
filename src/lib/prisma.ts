import { PrismaClient } from '../../node_modules/generated';

// With Data Proxy, we can just create a simple client
export const prisma = new PrismaClient();
