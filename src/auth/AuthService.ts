import { AuthUser, LoginResponse, AuthError } from './authTypes';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export class AuthService {
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    this.token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    this.user = userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  setAuth(response: LoginResponse): void {
    this.token = response.access_token;
    this.user = {
      username: response.username,
      email: `${response.username}@pimjo.com` // Default email format based on existing UI
    };

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, this.token);
    localStorage.setItem(USER_KEY, JSON.stringify(this.user));
  }

  clearAuth(): void {
    this.token = null;
    this.user = null;

    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  handleAuthError(error: any): AuthError {
    if (error?.status === 401) {
      // Token expired or invalid
      this.clearAuth();

      // Redirect to login if not already there
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }

      return {
        message: 'Session expired. Please login again.',
        status: 401
      };
    }

    return {
      message: error?.message || 'Authentication failed',
      status: error?.status
    };
  }

  // Check if current path requires authentication
  isProtectedRoute(pathname: string): boolean {
    const publicRoutes = ['/signin', '/signup'];
    return !publicRoutes.includes(pathname);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;