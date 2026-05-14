/**
 * ## server/src/config/database.ts
 * Database configuration using mysql2/promise pool
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server/.env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

let pool: mysql.Pool | null = null;

export const initPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gudangpro',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
};

export const getPool = (): mysql.Pool => {
  if (!pool) return initPool();
  return pool;
};

export const verifyConnection = async (retries = 5, delay = 3000) => {
  const currentPool = initPool();
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await currentPool.getConnection();
      console.log('✅ Database connected successfully');
      connection.release();
      return true;
    } catch (err: any) {
      console.error(`❌ Database connection failed (Attempt ${i + 1}/${retries}): ${err.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

export const healthCheck = async () => {
  try {
    const p = getPool();
    await p.query('SELECT 1');
    return { status: 'UP' };
  } catch (err) {
    return { status: 'DOWN', error: err instanceof Error ? err.message : String(err) };
  }
};
