/**
 * ## src/services/userApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const userApi = {
  getUsers: () => apiClient.get('/users'),
  getUserById: (id: string) => apiClient.get(`/users/${id}`),
  createUser: (data: any) => apiClient.post('/users', data),
  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`)
};
