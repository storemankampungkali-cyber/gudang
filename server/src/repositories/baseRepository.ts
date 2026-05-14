/**
 * ## server/src/repositories/baseRepository.ts
 * Base class for all repositories
 */

import { getPool } from '../config/database';
import logger from '../config/logger';
import { Pool, PoolConnection } from 'mysql2/promise';

export class BaseRepository {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  get db(): Pool {
    return getPool();
  }

  /**
   * Universal query executor with logging
   */
  async query(sql: string, params: any[] = [], conn: PoolConnection | Pool | null = null): Promise<any> {
    const executor = conn || this.db;
    const start = Date.now();
    try {
      const [results] = await (executor as any).execute(sql, params);
      const duration = Date.now() - start;
      logger.debug(`[SQL] ${this.tableName} - ${duration}ms`, { sql, params });
      return results;
    } catch (err: any) {
      logger.error(`[SQL Error] ${this.tableName}`, { sql, params, error: err.message });
      throw err;
    }
  }

  /**
   * Transaction wrapper
   */
  async withTransaction<T>(callback: (conn: PoolConnection) => Promise<T>): Promise<T> {
    const conn = await this.db.getConnection();
    await conn.beginTransaction();
    try {
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async findAll(filters: any = {}): Promise<any[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    const keys = Object.keys(filters);

    if (keys.length > 0) {
      sql += ' WHERE ' + keys.map(k => `${k} = ?`).join(' AND ');
      params.push(...Object.values(filters));
    }
    
    return this.query(sql, params);
  }

  async findById(id: string): Promise<any> {
    const rows = await this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async findOne(filters: any): Promise<any> {
    const rows = await this.findAll(filters);
    return rows[0] || null;
  }

  async create(data: any, conn: PoolConnection | null = null): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
    await this.query(sql, values, conn);
    return data;
  }

  async bulkCreate(dataArray: any[], conn: PoolConnection | null = null): Promise<any[]> {
    if (dataArray.length === 0) return [];
    
    const keys = Object.keys(dataArray[0]);
    const values: any[] = [];
    const placeholders = dataArray.map(data => {
      values.push(...Object.values(data));
      return `(${keys.map(() => '?').join(', ')})`;
    }).join(', ');

    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES ${placeholders}`;
    await this.query(sql, values, conn);
    return dataArray;
  }

  async update(id: string, data: any, conn: PoolConnection | null = null): Promise<boolean> {
    const keys = Object.keys(data);
    if (keys.length === 0) return false;
    const sql = `UPDATE ${this.tableName} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
    const values = [...Object.values(data), id];
    await this.query(sql, values, conn);
    return true;
  }

  async hardDelete(id: string, conn: PoolConnection | null = null): Promise<boolean> {
    await this.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], conn);
    return true;
  }

  async count(filters: any = {}): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params: any[] = [];
    const keys = Object.keys(filters);

    if (keys.length > 0) {
      sql += ' WHERE ' + keys.map(k => `${k} = ?`).join(' AND ');
      params.push(...Object.values(filters));
    }

    const rows = await this.query(sql, params);
    return rows[0].count;
  }
}
