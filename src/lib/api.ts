// ============================================
// FATI - API Client Configuration
// ============================================

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';

// API Base URL
const API_BASE_URL = 'https://projetstatagricole-production.up.railway.app';

// Utility functions for case conversion
const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const toSnake = (s: string) => {
  return s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const isArray = (a: any) => Array.isArray(a);
const isObject = (o: any) => o === Object(o) && !isArray(o) && typeof o !== 'function';

const keysToCamel = (o: any): any => {
  if (isObject(o)) {
    const n: any = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => keysToCamel(i));
  }
  return o;
};

const keysToSnake = (o: any): any => {
  if (isObject(o)) {
    const n: any = {};
    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = keysToSnake(o[k]);
    });
    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => keysToSnake(i));
  }
  return o;
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests and convert keys to snake_case
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Convert request data to snake_case
    if (config.data && config.headers['Content-Type'] === 'application/json') {
      config.data = keysToSnake(config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors, token refresh and convert keys to camelCase
apiClient.interceptors.response.use(
  (response) => {
    // Convert response data to camelCase
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          // Update token in store
          useAuthStore.setState({ token: access });

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Token ${access}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data);
      } else if (error.response.status === 404) {
        console.error('Resource not found:', error.config?.url);
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// Export API client
export default apiClient;

// Export helper types
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiError = {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
};
