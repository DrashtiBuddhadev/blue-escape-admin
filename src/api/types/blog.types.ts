export interface BlogContent {
  title: string;
  content: string;
}

export interface Blog {
  id: string;
  title: string;
  slug?: string;
  featured_media?: string;
  hero_media?: string;
  tags?: string[];
  excerpt?: string;
  content: BlogContent[];
  region?: string;
  country?: string;
  city?: string;
  author_name?: string;
  about_author?: string;
  read_time?: string;
  active?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogRequest {
  title: string;
  slug?: string;
  featured_media?: string;
  hero_media?: string;
  tags?: string[];
  excerpt?: string;
  content: BlogContent[];
  region?: string;
  country?: string;
  city?: string;
  author_name?: string;
  about_author?: string;
  read_time?: string;
  active?: boolean;
  published_at?: string;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {}

export interface BlogListParams {
  region?: string;
  country?: string;
  city?: string;
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  data: Blog;
}