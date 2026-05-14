/**
 * ## src/services/inventoryApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const inventoryApi = {
  getInventory: (warehouseId?: string) => 
    apiClient.get(`/inventory${warehouseId ? `?warehouseId=${warehouseId}` : ''}`),
  getItems: () => apiClient.get('/inventory/items'),
  getLowStock: () => apiClient.get('/inventory/low-stock'),
  createItem: (data: any) => apiClient.post('/inventory/items', data),
  updateItem: (id: string, data: any) => apiClient.put(`/inventory/items/${id}`, data),
  deleteItem: (id: string) => apiClient.delete(`/inventory/items/${id}`),
  bulkImport: (items: any[]) => apiClient.post('/inventory/bulk-import', items)
};
