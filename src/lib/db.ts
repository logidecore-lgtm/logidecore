import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

const getPrismaClient = () => {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const options = hasDbUrl
    ? {}
    : {
        datasources: {
          db: {
            url: 'postgresql://placeholder-for-build-time-only',
          },
        },
      };
  return new PrismaClient(options as any);
};

if (process.env.NODE_ENV === 'production') {
  prismaClient = getPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = getPrismaClient();
  }
  prismaClient = globalForPrisma.prisma;
}

export const db = prismaClient;
export * from '@prisma/client';
