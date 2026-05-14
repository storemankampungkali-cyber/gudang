/**
 * ## src/services/authApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const authApi = {
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me')
};

/**
 * ## src/services/inventoryApi.ts
 */
export const inventoryApi = {
  getItems: () => apiClient.get('/inventory'),
  getLowStock: () => apiClient.get('/inventory/low-stock'),
  createItem: (data: any) => apiClient.post('/inventory', data),
  updateItem: (id: string, data: any) => apiClient.put(`/inventory/${id}`, data),
  deleteItem: (id: string) => apiClient.delete(`/inventory/${id}`)
};

/**
 * ## src/services/transactionApi.ts
 */
export const transactionApi = {
  getTransactions: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/transactions?${query}`);
  },
  getTransactionDetail: (id: string) => apiClient.get(`/transactions/${id}`),
  createTransaction: (data: any) => apiClient.post('/transactions', data),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`)
};
