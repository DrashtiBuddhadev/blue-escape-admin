import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionContent,
  CreateCollectionContentRequest,
  UpdateCollectionContentRequest,
  CollectionListResponse,
  CollectionResponse,
  CollectionContentListResponse,
  CollectionContentResponse,
} from '../types';

class CollectionService {
  // Collections
  async getCollections(): Promise<Collection[]> {
    const response = await apiClient.get<CollectionListResponse>(ENDPOINTS.COLLECTIONS);
    return Array.isArray(response) ? response : response.data || [];
  }

  async getCollectionById(id: string): Promise<Collection> {
    const response = await apiClient.get<CollectionResponse>(ENDPOINTS.COLLECTION_BY_ID(id));
    return response.data || response;
  }

  async createCollection(data: CreateCollectionRequest): Promise<Collection> {
    const response = await apiClient.post<CollectionResponse>(ENDPOINTS.COLLECTIONS, data);
    return response.data || response;
  }

  async updateCollection(id: string, data: UpdateCollectionRequest): Promise<Collection> {
    const response = await apiClient.patch<CollectionResponse>(ENDPOINTS.COLLECTION_BY_ID(id), data);
    return response.data || response;
  }

  async deleteCollection(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.COLLECTION_BY_ID(id));
  }

  // Collection Content
  async getAllCollectionContents(): Promise<CollectionContent[]> {
    const response = await apiClient.get<CollectionContentListResponse>(ENDPOINTS.COLLECTION_CONTENT_ALL);
    return Array.isArray(response) ? response : response.data || [];
  }

  async getCollectionContentById(id: string): Promise<CollectionContent> {
    const response = await apiClient.get<CollectionContentResponse>(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id));
    return response.data || response;
  }

  async getContentsByCollection(collectionId: string): Promise<CollectionContent[]> {
    const response = await apiClient.get<CollectionContentListResponse>(ENDPOINTS.COLLECTION_CONTENTS_BY_COLLECTION(collectionId));
    return Array.isArray(response) ? response : response.data || [];
  }

  async createCollectionContent(data: CreateCollectionContentRequest): Promise<CollectionContent> {
    const response = await apiClient.post<CollectionContentResponse>(ENDPOINTS.COLLECTION_CONTENT, data);
    return response.data || response;
  }

  async updateCollectionContent(id: string, data: UpdateCollectionContentRequest): Promise<CollectionContent> {
    const response = await apiClient.patch<CollectionContentResponse>(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id), data);
    return response.data || response;
  }

  async deleteCollectionContent(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id));
  }
}

export const collectionService = new CollectionService();
export default collectionService;