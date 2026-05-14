/**
 * ## server/src/services/transactionService.ts
 */
import { TransactionRepository } from '../repositories/transactionRepository';
import { InventoryRepository } from '../repositories/inventoryRepository';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError';

const repo = new TransactionRepository();
const invRepo = new InventoryRepository();

export class TransactionService {
  async getAllTransactions(filters: any = {}) {
    return repo.getTransactionsWithItems(filters);
  }

  async getTransactionById(id: string) {
    const transaction = await repo.getTransactionWithItems(id);
    if (!transaction) throw new AppError('Transaksi tidak ditemukan', 404, 'NOT_FOUND');
    return transaction;
  }

  async createTransaction(data: any) {
    return repo.withTransaction(async (conn) => {
      const id = uuidv4();
      const { items, ...header } = data;

      // 1. Insert header
      await repo.create({ id, ...header }, conn);

      // 2. Insert items
      for (const item of items) {
        // Validate stock if OUT or TRANSFER
        if (header.type === 'OUT' || header.type === 'TRANSFER') {
          const currentQty = await invRepo.getStock(item.item_id, header.source_warehouse_id, conn);
          if (currentQty < item.qty) {
            throw new AppError(`Stok item ${item.item_id} tidak mencukupi`, 400, 'INSUFFICIENT_STOCK');
          }
        }

        await repo.query(
          'INSERT INTO transaction_items (transaction_id, item_id, qty, unit, note) VALUES (?, ?, ?, ?, ?)',
          [id, item.item_id, item.qty, item.unit, item.note || ''],
          conn
        );
      }

      return this.getTransactionById(id);
    });
  }

  async deleteTransaction(id: string) {
    return repo.hardDelete(id);
  }
}
