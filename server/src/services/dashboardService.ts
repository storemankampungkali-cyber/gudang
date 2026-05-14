/**
 * ## server/src/services/dashboardService.ts
 */
import { BaseRepository } from '../repositories/baseRepository';

const warehouseRepo = new BaseRepository('warehouses');
const itemRepo = new BaseRepository('items');
const transactionRepo = new BaseRepository('transactions');
const rejectRepo = new BaseRepository('rejections');

export class DashboardService {
  async getStats() {
    const [warehouseCount, itemCount, transactionCount, rejectCount] = await Promise.all([
      warehouseRepo.count(),
      itemRepo.count(),
      transactionRepo.count(),
      rejectRepo.count()
    ]);

    // Simple recent activity
    const recentTransactions = await transactionRepo.query(
      'SELECT t.*, w.name as warehouse_name FROM transactions t LEFT JOIN warehouses w ON t.target_warehouse_id = w.id ORDER BY t.date DESC LIMIT 5'
    );

    return {
      warehouses: warehouseCount,
      items: itemCount,
      transactions: transactionCount,
      rejections: rejectCount,
      recentTransactions
    };
  }
}
