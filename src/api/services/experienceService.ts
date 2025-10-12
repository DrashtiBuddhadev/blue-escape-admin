import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Experience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  ExperienceListParams,
  ExperienceListResponse,
} from '../types';

class ExperienceService {
  async getExperiences(params?: ExperienceListParams): Promise<ExperienceListResponse> {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
    };
    return await apiClient.get<ExperienceListResponse>(ENDPOINTS.EXPERIENCES, queryParams);
  }

  async getActiveExperiences(params?: ExperienceListParams): Promise<ExperienceListResponse> {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
      active: true,
    };
    console.log('Fetching active experiences with params:', queryParams);
    return await apiClient.get<ExperienceListResponse>(ENDPOINTS.EXPERIENCES, queryParams);
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