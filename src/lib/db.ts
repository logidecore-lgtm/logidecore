import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

let pool: Pool;
let prismaClient: PrismaClient;

const isProduction = process.env.NODE_ENV === 'production';

const createPool = () =>
  new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
    max: isProduction ? 10 : 3,
    min: 0,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    allowExitOnIdle: !isProduction,
  });

if (!globalForPrisma.pool) {
  globalForPrisma.pool = createPool();
}

pool = globalForPrisma.pool;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(pool);

  globalForPrisma.prisma = new PrismaClient({
    adapter,
  });
}

prismaClient = globalForPrisma.prisma;

export const db = prismaClient;
export * from '@prisma/client';
