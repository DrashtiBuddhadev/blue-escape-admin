import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { HealthResponse } from '../types';

class HealthService {
  async getHealth(): Promise<HealthResponse> {
    return await apiClient.get<HealthResponse>(ENDPOINTS.HEALTH);
  }
}

export const healthService = new HealthService();
export default healthService;