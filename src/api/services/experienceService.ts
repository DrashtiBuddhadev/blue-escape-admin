import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Experience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  ExperienceListParams,
  ExperienceListResponse,
  ExperienceResponse,
} from '../types';

class ExperienceService {
  async getExperiences(params?: ExperienceListParams): Promise<Experience[]> {
    const response = await apiClient.get<ExperienceListResponse>(ENDPOINTS.EXPERIENCES, params);
    return Array.isArray(response) ? response : response.data || [];
  }

  async getExperienceById(id: string): Promise<Experience> {
    const response = await apiClient.get<ExperienceResponse>(ENDPOINTS.EXPERIENCE_BY_ID(id));
    return response.data || response;
  }

  async createExperience(data: CreateExperienceRequest): Promise<Experience> {
    const response = await apiClient.post<ExperienceResponse>(ENDPOINTS.EXPERIENCES, data);
    return response.data || response;
  }

  async updateExperience(id: string, data: UpdateExperienceRequest): Promise<Experience> {
    const response = await apiClient.patch<ExperienceResponse>(ENDPOINTS.EXPERIENCE_BY_ID(id), data);
    return response.data || response;
  }

  async deleteExperience(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.EXPERIENCE_BY_ID(id));
  }
}

export const experienceService = new ExperienceService();
export default experienceService;