/**
 * ## server/src/services/rejectService.ts
 */
import { RejectRepository } from '../repositories/rejectRepository';
import { InventoryRepository } from '../repositories/inventoryRepository';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError';

const repo = new RejectRepository();
const invRepo = new InventoryRepository();

export class RejectService {
  async getAllRejections() {
    return repo.findAllWithDetails();
  }

  async createRejection(data: any) {
    return repo.withTransaction(async (conn) => {
      const id = uuidv4();
      const { items, ...header } = data;

      // 1. Create batch
      await repo.create({ id, ...header }, conn);

      // 2. Create items
      for (const item of items) {
        // Check stock
        const currentQty = await invRepo.getStock(item.item_id, header.warehouse_id, conn);
        if (currentQty < item.qty) {
          throw new AppError(`Stok item ${item.item_id} tidak mencukupi`, 400, 'INSUFFICIENT_STOCK');
        }

        await repo.query(
          'INSERT INTO reject_items (batch_id, item_id, qty, reason) VALUES (?, ?, ?, ?)',
          [id, item.item_id, item.qty, item.reason || ''],
          conn
        );
      }

      return repo.findByIdWithDetails(id);
    });
  }

  async deleteRejection(id: string) {
    return repo.hardDelete(id);
  }
}
