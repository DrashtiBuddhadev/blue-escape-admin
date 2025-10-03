export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

export interface TagListResponse {
  data: Tag[];
  total: number;
}

export interface TagResponse {
  data: Tag;
}
