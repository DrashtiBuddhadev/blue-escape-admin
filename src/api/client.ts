import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import apiConfig from './config';

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const axiosInstance = axios.create({
      baseURL: apiConfig.BASE_URL,
      timeout: apiConfig.TIMEOUT,
      headers: apiConfig.DEFAULT_HEADERS,
    });

    // Setup cache interceptor with 2-minute TTL
    this.client = setupCache(axiosInstance, {
      ttl: 2 * 60 * 1000, // 2 minutes in milliseconds
      methods: ['get'], // Only cache GET requests
      cachePredicate: {
        statusCheck: (status) => status >= 200 && status < 300, // Only cache successful responses
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth headers
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication headers
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (apiConfig.ENABLE_LOGGING) {
          console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        }
        return config;
      },
      (error) => {
        if (apiConfig.ENABLE_LOGGING) {
          console.error('Request error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (apiConfig.ENABLE_LOGGING) {
          console.log(`Response received:`, response.status);
        }
        return response;
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An unexpected error occurred',
          status: error.response?.status,
          data: error.response?.data,
        };

        // Handle 401 Unauthorized responses
        if (error.response?.status === 401) {
          // Clear auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');

          // Redirect to login if not already there
          if (window.location.pathname !== '/signin') {
            console.log('Session expired. Redirecting to login...');
            window.location.href = '/signin';
          }

          apiError.message = 'Session expired. Please login again.';
        }

        if (apiConfig.ENABLE_LOGGING) {
          console.error('API Error:', apiError);
        }
        return Promise.reject(apiError);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;