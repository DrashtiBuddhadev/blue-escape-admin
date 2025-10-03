import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Experience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  ExperienceListParams,
} from '../types';

class ExperienceService {
  async getExperiences(params?: ExperienceListParams): Promise<Experience[]> {
    return await apiClient.get<Experience[]>(ENDPOINTS.EXPERIENCES, params);
  }

  async getActiveExperiences(params?: ExperienceListParams): Promise<Experience[]> {
    const activeParams = { ...params, active: true };
    console.log('Fetching active experiences with params:', activeParams);
    return await apiClient.get<Experience[]>(ENDPOINTS.EXPERIENCES, activeParams);
  }

  async getExperienceById(id: string): Promise<Experience> {
    return await apiClient.get<Experience>(ENDPOINTS.EXPERIENCE_BY_ID(id));
  }

  async createExperience(data: CreateExperienceRequest): Promise<Experience> {
    return await apiClient.post<Experience>(ENDPOINTS.EXPERIENCES, data);
  }

  async updateExperience(id: string, data: UpdateExperienceRequest): Promise<Experience> {
    console.log('ExperienceService.updateExperience called with:', {
      id,
      endpoint: ENDPOINTS.EXPERIENCE_BY_ID(id),
      data: JSON.stringify(data, null, 2)
    });
    return await apiClient.patch<Experience>(ENDPOINTS.EXPERIENCE_BY_ID(id), data);
  }

  async deleteExperience(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.EXPERIENCE_BY_ID(id));
  }
}

export const experienceService = new ExperienceService();
export default experienceService;