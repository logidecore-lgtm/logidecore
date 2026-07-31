import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

// Use a placeholder URL during the build phase if DATABASE_URL is missing to prevent build-time crashes
const prismaOptions = process.env.DATABASE_URL
  ? {}
  : {
      datasources: {
        db: {
          url: 'postgresql://placeholder-for-build-time-only',
        },
      },
    };

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient(prismaOptions);
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient(prismaOptions);
  }
  prismaClient = globalForPrisma.prisma;
}

export const db = prismaClient;
export * from '@prisma/client';
