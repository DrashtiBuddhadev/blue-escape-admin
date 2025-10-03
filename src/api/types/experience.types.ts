export interface BestTime {
  from: string;
  to: string;
}

export interface ExperienceContent {
  title: string;
  content: string;
}

export interface GalleryItem {
  name: string;
  image: string;
}

export interface Experience {
  id: string;
  title: string;
  featured_media?: string;
  excerpt?: string;
  country?: string;
  city?: string;
  region?: string;
  best_time?: BestTime[];
  carousel_images?: string[]; // Array of 3-8 image URLs
  brief_description?: string;
  content?: ExperienceContent[];
  tagline?: Record<string, any>; // JSON field for taglines
  gallery?: GalleryItem[];
  story?: string;
  tags?: string[]; // Array of tags for categorizing experiences
  created_at: string;
  updated_at: string;
}

export interface CreateExperienceRequest {
  title: string;
  featured_media?: string;
  excerpt?: string;
  country?: string;
  city?: string;
  region?: string;
  best_time?: BestTime[];
  carousel_images?: string[]; // Array of 3-8 image URLs
  brief_description?: string;
  content?: ExperienceContent[];
  tagline?: Record<string, any>; // JSON field for taglines
  gallery?: GalleryItem[];
  story?: string;
  tags?: string[]; // Array of tags for categorizing experiences
}

export interface UpdateExperienceRequest extends Partial<CreateExperienceRequest> {}

export interface ExperienceListParams {
  region?: string;
  country?: string;
  city?: string;
  tag?: string;
}

export interface ExperienceListResponse {
  data: Experience[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ExperienceResponse {
  data: Experience;
}