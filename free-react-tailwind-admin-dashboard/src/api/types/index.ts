export * from './blog.types';
export * from './collection.types';
export * from './experience.types';
export * from './contact.types';
export * from './tag.types';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}