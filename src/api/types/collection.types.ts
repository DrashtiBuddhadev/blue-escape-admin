export interface Collection {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionRequest {
  name: string;
}

export interface UpdateCollectionRequest extends Partial<CreateCollectionRequest> {}

export interface Feature {
  title: string;
  content: string;
  images: string[]; // Array of 2-5 image URLs
}

export interface AboutDestination {
  title: string;
  content: string;
}

export interface CollectionContent {
  id: string;
  collection_id: string;
  hero_media?: string;
  about_collection?: string;
  features?: Feature[];
  about_destination?: AboutDestination[];
  region?: string;
  country?: string;
  city?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
  collection?: Collection;
}

export interface CreateCollectionContentRequest {
  collection_id: string;
  hero_media?: string;
  about_collection?: string;
  features?: Feature[];
  about_destination?: AboutDestination[];
  region?: string;
  country?: string;
  city?: string;
  active?: boolean;
}

export interface UpdateCollectionContentRequest extends Partial<Omit<CreateCollectionContentRequest, 'collection_id'>> {}

export interface CollectionListResponse {
  data: Collection[];
  total: number;
}

export interface CollectionResponse {
  data: Collection;
}

export interface CollectionContentListResponse {
  data: CollectionContent[];
  total: number;
}

export interface CollectionContentResponse {
  data: CollectionContent;
}