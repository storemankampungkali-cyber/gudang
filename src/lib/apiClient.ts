/**
 * ## src/lib/apiClient.ts
 * Unified fetch wrapper for API calls
 */

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = 'API_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const API_BASE_URL = '/api/v1';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
      throw new ApiError(data.error?.message || response.statusText, response.status, data.error?.code);
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new ApiError('Request timeout', 408, 'TIMEOUT');
    throw err;
  }
}

export const apiClient = {
  get: (path: string, options?: RequestInit) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: RequestInit) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body?: any, options?: RequestInit) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string, body?: any, options?: RequestInit) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string, options?: RequestInit) => request(path, { ...options, method: 'DELETE' })
};
