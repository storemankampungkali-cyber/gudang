/**
 * ## server/src/repositories/rejectRepository.ts
 */
import { BaseRepository } from './baseRepository';

export class RejectRepository extends BaseRepository {
  constructor() {
    super('reject_batches');
  }

  async findAllWithDetails() {
    return this.query(`
      SELECT rb.*, w.name as warehouse_name
      FROM reject_batches rb
      JOIN warehouses w ON rb.warehouse_id = w.id
      ORDER BY rb.created_at DESC
    `);
  }

  async findByIdWithDetails(id: string) {
    const rows = await this.query(`
      SELECT rb.*, w.name as warehouse_name
      FROM reject_batches rb
      JOIN warehouses w ON rb.warehouse_id = w.id
      WHERE rb.id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    const batch = rows[0];

    batch.items = await this.query(`
      SELECT ri.*, i.name as item_name, i.code as item_code
      FROM reject_items ri
      JOIN items i ON ri.item_id = i.id
      WHERE ri.batch_id = ?
    `, [batch.id]);

    return batch;
  }
}
