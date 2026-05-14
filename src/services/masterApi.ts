/**
 * ## src/services/masterApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const warehouseApi = {
  getWarehouses: () => apiClient.get('/warehouses'),
  createWarehouse: (data: any) => apiClient.post('/warehouses', data),
  updateWarehouse: (id: string, data: any) => apiClient.put(`/warehouses/${id}`, data),
  deleteWarehouse: (id: string) => apiClient.delete(`/warehouses/${id}`)
};

export const partnerApi = {
  getPartners: (type?: string) => apiClient.get(`/partners${type ? `?type=${type}` : ''}`),
  createPartner: (data: any) => apiClient.post('/partners', data),
  updatePartner: (id: string, data: any) => apiClient.put(`/partners/${id}`, data),
  deletePartner: (id: string) => apiClient.delete(`/partners/${id}`)
};

export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary')
};

export const reportApi = {
  getStockSummary: (filters: any = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/reports/stock-summary?${query}`);
  },
  getStockMutation: (filters: any = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/reports/stock-mutation?${query}`);
  },
  exportExcel: (type: string, filters: any) => {
    const query = new URLSearchParams(filters).toString();
    return `/api/reports/export?type=${type}&${query}`;
  }
};
