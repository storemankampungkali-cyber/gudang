/**
 * ## src/services/transactionApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const transactionApi = {
  getTransactions: (filters: any = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/transactions?${query}`);
  },
  getTransactionDetail: (id: string) => apiClient.get(`/transactions/${id}`),
  createTransaction: (data: any) => apiClient.post('/transactions', data),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`)
};
