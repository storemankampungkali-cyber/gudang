/**
 * ## server/src/repositories/transactionRepository.ts
 */

import { BaseRepository } from './baseRepository';

export class TransactionRepository extends BaseRepository {
  constructor() {
    super('transactions');
  }

  async getTransactionsWithItems(filters: any = {}) {
    let sql = `
      SELECT t.*, 
             sw.name as source_warehouse_name, 
             tw.name as target_warehouse_name,
             p.name as partner_name
      FROM transactions t
      LEFT JOIN warehouses sw ON t.source_warehouse_id = sw.id
      LEFT JOIN warehouses tw ON t.target_warehouse_id = tw.id
      LEFT JOIN partners p ON t.partner_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.start && filters.end) {
      sql += ' AND t.date BETWEEN ? AND ?';
      params.push(filters.start, filters.end);
    }
    if (filters.warehouseId) {
      sql += ' AND (t.source_warehouse_id = ? OR t.target_warehouse_id = ?)';
      params.push(filters.warehouseId, filters.warehouseId);
    }
    if (filters.type) {
      sql += ' AND t.type = ?';
      params.push(filters.type);
    }

    sql += ' ORDER BY t.date DESC, t.created_at DESC';
    
    const transactions = await this.query(sql, params);

    // Fetch items for each transaction
    for (const tx of transactions) {
      tx.items = await this.query(
        `SELECT ti.*, i.name as item_name, i.code as item_code 
         FROM transaction_items ti 
         JOIN items i ON ti.item_id = i.id 
         WHERE ti.transaction_id = ?`,
        [tx.id]
      );
    }

    return transactions;
  }

  async getTransactionWithItems(id: string) {
    const rows = await this.query(
      `SELECT t.*, sw.name as source_warehouse_name, tw.name as target_warehouse_name, p.name as partner_name
       FROM transactions t
       LEFT JOIN warehouses sw ON t.source_warehouse_id = sw.id
       LEFT JOIN warehouses tw ON t.target_warehouse_id = tw.id
       LEFT JOIN partners p ON t.partner_id = p.id
       WHERE t.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    const tx = rows[0];

    tx.items = await this.query(
      `SELECT ti.*, i.name as item_name, i.code as item_code 
       FROM transaction_items ti 
       JOIN items i ON ti.item_id = i.id 
       WHERE ti.transaction_id = ?`,
      [tx.id]
    );

    return tx;
  }
}
