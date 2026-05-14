/**
 * ## server/src/services/reportService.ts
 */
import { BaseRepository } from '../repositories/baseRepository';

const repo = new BaseRepository('transactions');

export class ReportService {
  async getStockReport(filters: any = {}) {
    let sql = `
      SELECT 
        w.name as warehouse_name,
        i.id as item_id,
        i.code as item_code,
        i.name as item_name,
        i.category,
        COALESCE(SUM(CASE 
          WHEN t.type = 'IN' AND t.target_warehouse_id = w.id THEN ti.qty
          WHEN t.type = 'TRANSFER' AND t.target_warehouse_id = w.id THEN ti.qty
          WHEN t.type = 'OUT' AND t.source_warehouse_id = w.id THEN -ti.qty
          WHEN t.type = 'TRANSFER' AND t.source_warehouse_id = w.id THEN -ti.qty
          WHEN t.type = 'REJECT' AND t.source_warehouse_id = w.id THEN -ti.qty
          ELSE 0 
        END), 0) as current_stock
      FROM warehouses w
      CROSS JOIN items i
      LEFT JOIN transaction_items ti ON ti.item_id = i.id
      LEFT JOIN transactions t ON ti.transaction_id = t.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.warehouseId) {
      sql += ' AND w.id = ?';
      params.push(filters.warehouseId);
    }

    if (filters.itemId) {
      sql += ' AND i.id = ?';
      params.push(filters.itemId);
    }

    if (filters.date) {
      sql += ' AND t.date <= ?';
      params.push(filters.date);
    }

    sql += ' GROUP BY w.id, i.id';
    
    // Only show items with stock if no specific item requested
    if (!filters.itemId) {
      sql += ' HAVING current_stock > 0';
    }

    return repo.query(sql, params);
  }

  async getMutationReport(filters: any = {}) {
    let sql = `
      SELECT 
        ti.*,
        t.date,
        t.type,
        t.reference_no,
        i.name as item_name,
        i.code as item_code,
        sw.name as source_warehouse,
        tw.name as target_warehouse
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN items i ON ti.item_id = i.id
      LEFT JOIN warehouses sw ON t.source_warehouse_id = sw.id
      LEFT JOIN warehouses tw ON t.target_warehouse_id = tw.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.itemId) {
      sql += ' AND ti.item_id = ?';
      params.push(filters.itemId);
    }

    if (filters.startDate) {
      sql += ' AND t.date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ' AND t.date <= ?';
      params.push(filters.endDate);
    }

    if (filters.type) {
      sql += ' AND t.type = ?';
      params.push(filters.type);
    }

    if (filters.warehouseId) {
      sql += ' AND (t.source_warehouse_id = ? OR t.target_warehouse_id = ?)';
      params.push(filters.warehouseId, filters.warehouseId);
    }

    sql += ' ORDER BY t.date DESC, t.id DESC';
    return repo.query(sql, params);
  }
}
