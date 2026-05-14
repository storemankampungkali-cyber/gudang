/**
 * ## server/src/services/warehouseService.ts
 */
import { WarehouseRepository } from '../repositories/warehouseRepository';
import { v4 as uuidv4 } from 'uuid';

const repo = new WarehouseRepository();

export class WarehouseService {
  async getAllWarehouses() {
    return repo.findAll();
  }

  async createWarehouse(data: any) {
    const id = uuidv4();
    return repo.create({ id, ...data });
  }

  async updateWarehouse(id: string, data: any) {
    return repo.update(id, data);
  }

  async deleteWarehouse(id: string) {
    return repo.hardDelete(id);
  }
}
