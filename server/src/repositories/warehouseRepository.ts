/**
 * ## server/src/repositories/warehouseRepository.ts
 */
import { BaseRepository } from './baseRepository';

export class WarehouseRepository extends BaseRepository {
  constructor() {
    super('warehouses');
  }
}
