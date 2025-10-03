import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from '../types';

class TagService {
  async getTags(): Promise<Tag[]> {
    return await apiClient.get<Tag[]>(ENDPOINTS.TAGS);
  }

  async getTagById(id: string): Promise<Tag> {
    return await apiClient.get<Tag>(ENDPOINTS.TAG_BY_ID(id));
  }

  async createTag(data: CreateTagRequest): Promise<Tag> {
    return await apiClient.post<Tag>(ENDPOINTS.TAGS, data);
  }

  async updateTag(id: string, data: UpdateTagRequest): Promise<Tag> {
    return await apiClient.patch<Tag>(ENDPOINTS.TAG_BY_ID(id), data);
  }

  async deleteTag(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.TAG_BY_ID(id));
  }
}

export const tagService = new TagService();
export default tagService;
