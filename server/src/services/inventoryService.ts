/**
 * ## server/src/services/inventoryService.ts
 */
import { InventoryRepository } from '../repositories/inventoryRepository';
import { v4 as uuidv4 } from 'uuid';

const repo = new InventoryRepository();

export class InventoryService {
  async getStock(filters: any = {}) {
    return repo.getItemsWithStock(filters.warehouseId);
  }

  async getItems() {
    return repo.findAll();
  }

  async getLowStock() {
    return repo.getLowStockItems();
  }

  async createItem(data: any) {
    const id = uuidv4();
    return repo.create({ id, ...data });
  }

  async bulkImportItems(itemsData: any[]) {
    return repo.withTransaction(async (conn) => {
      const results = {
        success: 0,
        failed: 0,
        errors: [] as any[]
      };

      const itemsToInsert: any[] = [];
      const codes = new Set();

      for (let i = 0; i < itemsData.length; i++) {
        const item = itemsData[i];
        try {
          // Check for duplicate code in same batch
          if (codes.has(item.code)) {
            throw new Error(`Kode barang duplikat di baris ${i + 1}`);
          }
          codes.add(item.code);

          // Check if code already exists in DB
          const existing = await repo.findOne({ code: item.code });
          if (existing) {
            throw new Error(`Kode barang ${item.code} sudah terdaftar`);
          }

          const id = uuidv4();
          itemsToInsert.push({
            id,
            code: item.code,
            name: item.name,
            category: item.category || '',
            base_unit: item.base_unit,
            min_stock: item.min_stock || 0,
            is_active: item.is_active !== undefined ? item.is_active : true,
            created_at: new Date()
          });
          results.success++;
        } catch (err: any) {
          results.failed++;
          results.errors.push({ row: i + 1, error: err.message });
        }
      }

      if (itemsToInsert.length > 0) {
        await repo.bulkCreate(itemsToInsert, conn);
      }

      return results;
    });
  }

  async updateItem(id: string, data: any) {
    return repo.update(id, data);
  }

  async deleteItem(id: string) {
    return repo.hardDelete(id);
  }
}
