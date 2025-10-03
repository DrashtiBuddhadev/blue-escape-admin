import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionContent,
  CreateCollectionContentRequest,
  UpdateCollectionContentRequest,
} from '../types';

class CollectionService {
  // Collections
  async getCollections(): Promise<Collection[]> {
    return await apiClient.get<Collection[]>(ENDPOINTS.COLLECTIONS);
  }

  async getCollectionById(id: string): Promise<Collection> {
    return await apiClient.get<Collection>(ENDPOINTS.COLLECTION_BY_ID(id));
  }

  async createCollection(data: CreateCollectionRequest): Promise<Collection> {
    return await apiClient.post<Collection>(ENDPOINTS.COLLECTIONS, data);
  }

  async updateCollection(id: string, data: UpdateCollectionRequest): Promise<Collection> {
    console.log('CollectionService.updateCollection called with:', {
      id,
      endpoint: ENDPOINTS.COLLECTION_BY_ID(id),
      data: JSON.stringify(data, null, 2)
    });
    return await apiClient.patch<Collection>(ENDPOINTS.COLLECTION_BY_ID(id), data);
  }

  async deleteCollection(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.COLLECTION_BY_ID(id));
  }

  // Collection Content
  async getAllCollectionContents(): Promise<CollectionContent[]> {
    return await apiClient.get<CollectionContent[]>(ENDPOINTS.COLLECTION_CONTENT_ALL);
  }

  async getCollectionContentById(id: string): Promise<CollectionContent> {
    return await apiClient.get<CollectionContent>(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id));
  }

  async getContentsByCollection(collectionId: string): Promise<CollectionContent[]> {
    return await apiClient.get<CollectionContent[]>(ENDPOINTS.COLLECTION_CONTENTS_BY_COLLECTION(collectionId));
  }

  async createCollectionContent(data: CreateCollectionContentRequest): Promise<CollectionContent> {
    return await apiClient.post<CollectionContent>(ENDPOINTS.COLLECTION_CONTENT, data);
  }

  async updateCollectionContent(id: string, data: UpdateCollectionContentRequest): Promise<CollectionContent> {
    console.log('CollectionService.updateCollectionContent called with:', {
      id,
      endpoint: ENDPOINTS.COLLECTION_CONTENT_BY_ID(id),
      data: JSON.stringify(data, null, 2)
    });
    return await apiClient.patch<CollectionContent>(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id), data);
  }

  async deleteCollectionContent(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.COLLECTION_CONTENT_BY_ID(id));
  }
}

export const collectionService = new CollectionService();
export default collectionService;