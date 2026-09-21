import path from 'path';
import fs from 'fs';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'projecthub_secret_key_dev_2026_super_secure';
}

// Copy dev.db to /tmp if executing in Vercel serverless environment
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
if (isVercel) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const bundleDbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
    if (fs.existsSync(bundleDbPath)) {
      try {
        fs.copyFileSync(bundleDbPath, tmpDbPath);
      } catch (e) {
        console.error('Failed copying database to /tmp:', e);
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
} else if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

import app from '../server/src/index.js';

export default app;
