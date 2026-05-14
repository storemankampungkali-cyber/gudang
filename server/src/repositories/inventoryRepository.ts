/**
 * ## server/src/repositories/inventoryRepository.ts
 */

import { BaseRepository } from './baseRepository';
import { PoolConnection } from 'mysql2/promise';

export class InventoryRepository extends BaseRepository {
  constructor() {
    super('items');
  }

  async getItemsWithStock(warehouseId?: string) {
    let sql = `
      SELECT i.*, COALESCE(SUM(s.qty), 0) as total_stock
      FROM items i
      LEFT JOIN stock s ON i.id = s.item_id
    `;
    const params: any[] = [];
    
    if (warehouseId) {
      sql += ' WHERE s.warehouse_id = ? OR s.warehouse_id IS NULL';
      params.push(warehouseId);
    }
    
    sql += ' GROUP BY i.id';
    return this.query(sql, params);
  }

  async getStock(itemId: string, warehouseId: string, conn: PoolConnection | null = null) {
    const sql = `SELECT qty FROM stock WHERE item_id = ? AND warehouse_id = ? FOR UPDATE`;
    const rows = await this.query(sql, [itemId, warehouseId], conn);
    return rows.length > 0 ? parseFloat(rows[0].qty) : 0;
  }

  async upsertStock(warehouseId: string, itemId: string, delta: number, op: '+' | '-', conn: PoolConnection) {
    // Check if exists
    const existing = await this.query(`SELECT 1 FROM stock WHERE warehouse_id = ? AND item_id = ?`, [warehouseId, itemId], conn);
    
    if (existing.length === 0) {
      if (op === '-' && delta > 0) {
        // Initialize with 0 then subtract will be handled by negative check in service
        await this.query(`INSERT INTO stock (warehouse_id, item_id, qty) VALUES (?, ?, 0)`, [warehouseId, itemId], conn);
      } else {
        await this.query(`INSERT INTO stock (warehouse_id, item_id, qty) VALUES (?, ?, ?)`, [warehouseId, itemId, delta], conn);
        return;
      }
    }

    const sql = `UPDATE stock SET qty = qty ${op} ? WHERE warehouse_id = ? AND item_id = ?`;
    await this.query(sql, [delta, warehouseId, itemId], conn);
  }

  async getLowStockItems() {
    const sql = `
      SELECT i.*, COALESCE(SUM(s.qty), 0) as current_stock
      FROM items i
      LEFT JOIN stock s ON i.id = s.item_id
      GROUP BY i.id
      HAVING current_stock <= i.min_stock
    `;
    return this.query(sql);
  }

  async getItemUnits(itemId: string) {
    return this.query(`SELECT * FROM item_units WHERE item_id = ?`, [itemId]);
  }
}
