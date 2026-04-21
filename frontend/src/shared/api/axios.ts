import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';
import { useAdminAuthStore } from '../../features/admin/stores/useAdminAuthStore';

// Define the generic response structure based on the backend architecture
export interface Result<T = unknown> {
  success: boolean;
  errorMsg: string | null;
  data: T;
  total?: number;
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
});

// Request Interceptor: Attach token if available
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAdminApi = config.url?.startsWith('/api/admin');
    
    if (isAdminApi) {
      const adminToken = useAdminAuthStore.getState().adminToken;
      if (adminToken && config.headers) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unified response structure and 401 Unauthorized
request.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const res = response.data;
    
    // If the logical 'success' flag is false, reject with the error message
    if (res && res.success === false) {
      return Promise.reject(new Error(res.errorMsg || 'Server Error'));
    }
    
    // Transparently return the generic structure
    return response.data as unknown as AxiosResponse['data']; 
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      // Clear local auth state based on the request URL
      if (error.config?.url?.startsWith('/api/admin')) {
        useAdminAuthStore.getState().logout();
      } else {
        useAuthStore.getState().logout();
      }
    }
    
    // Extract backend error message if available
    let errorMsg = error.message;
    const errorData = error.response?.data as Record<string, unknown> | undefined;
    if (errorData && typeof errorData.errorMsg === 'string') {
       errorMsg = errorData.errorMsg;
    }
    
    return Promise.reject(new Error(errorMsg));
  }
);

export default request;
