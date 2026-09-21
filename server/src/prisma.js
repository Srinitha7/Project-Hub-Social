import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl() {
  // If explicitly set to external database (e.g. Postgres / Supabase / Neon), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dev.db')) {
    return process.env.DATABASE_URL;
  }

  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isVercel) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const bundleDbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
      if (fs.existsSync(bundleDbPath)) {
        try {
          fs.copyFileSync(bundleDbPath, tmpDbPath);
        } catch (e) {
          console.error('Failed to copy database to /tmp:', e);
        }
      }
    }
    return `file:${tmpDbPath}`;
  }

  const localDbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
  return `file:${localDbPath}`;
}

const dbUrl = getDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

export default prisma;
