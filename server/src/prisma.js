import { PrismaClient } from '@prisma/client';
import path from 'path';

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl === 'file:./dev.db') {
  const dbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
  dbUrl = `file:${dbPath}`;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

export default prisma;
