import { apiClient } from '../client';
import { LoginRequest, LoginResponse } from '../../auth/authTypes';

class AuthApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('AuthApiService.login called with:', {
      username: credentials.username,
      // Don't log password for security
      hasPassword: !!credentials.password
    });

    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    console.log('Login response received:', {
      username: response.username,
      hasToken: !!response.access_token
    });

    return response;
  }

  // Optional: Add refresh token functionality if your backend supports it
  async refreshToken(): Promise<LoginResponse> {
    return await apiClient.post<LoginResponse>('/auth/refresh');
  }

  // Optional: Add logout endpoint if your backend has one
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}

export const authApiService = new AuthApiService();
export default authApiService;