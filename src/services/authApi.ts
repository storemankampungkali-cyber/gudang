/**
 * ## src/services/authApi.ts
 */
import { apiClient } from '../lib/apiClient';

export const authApi = {
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('auth_token');
  }
};
