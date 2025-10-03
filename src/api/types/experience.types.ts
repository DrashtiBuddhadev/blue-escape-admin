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
  taglines?: string[];
  country?: string;
  city?: string;
  region?: string;
  best_time?: BestTime[];
  carousel_media?: string[];
  brief_description?: string;
  content?: ExperienceContent[];
  gallery?: GalleryItem[];
  story?: string;
  tags?: string[];
  duration?: number;
  price?: number;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateExperienceRequest {
  title: string;
  featured_media?: string;
  taglines?: string[];
  country?: string;
  city?: string;
  region?: string;
  best_time?: BestTime[];
  carousel_media?: string[];
  brief_description?: string;
  content?: ExperienceContent[];
  gallery?: GalleryItem[];
  story?: string;
  tags?: string[];
  duration?: number;
  price?: number;
  active?: boolean;
}

export interface UpdateExperienceRequest extends Partial<CreateExperienceRequest> {}

export interface ExperienceListParams {
  region?: string;
  country?: string;
  city?: string;
  tag?: string;
  active?: boolean;
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