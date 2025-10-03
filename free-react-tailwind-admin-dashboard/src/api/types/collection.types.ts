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
  images: { media: string[] }; // Array of image URLs to support 1-5 images
}

export interface AboutDestination {
  title: string;
  content: string;
  description?: string;
}

export interface AboutDestinationBackend {
  description: string;
}

export interface CollectionContent {
  id: string;
  collection_id: string;
  property_name?: string;
  featured_img?: string;
  hero_media?: string;
  about_collection?: string;
  features?: Feature[];
  about_destination?: AboutDestination[] | AboutDestinationBackend;
  region?: string;
  country?: string;
  city?: string;
  tags?: string[];
  active?: boolean;
  created_at: string;
  updated_at: string;
  collection?: Collection;
}

export interface CreateCollectionContentRequest {
  collection_id: string;
  property_name?: string;
  featured_img?: string;
  hero_media?: string;
  about_collection?: string;
  features?: Feature[];
  about_destination?: AboutDestinationBackend;
  region?: string;
  country?: string;
  city?: string;
  tags?: string[];
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