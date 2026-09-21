import path from 'path';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'projecthub_secret_key_dev_2026_super_secure';
}

if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

import app from '../server/src/index.js';

export default app;
