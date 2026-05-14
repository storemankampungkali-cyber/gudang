/**
 * ## src/services/rejectApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const rejectApi = {
  getRejects: () => apiClient.get('/rejects'),
  createReject: (data: any) => apiClient.post('/rejects', data),
  deleteReject: (id: string) => apiClient.delete(`/rejects/${id}`)
};
