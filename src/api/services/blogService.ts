import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogListParams,
  BlogListResponse,
  BlogResponse,
} from '../types';

class BlogService {
  async getBlogs(params?: BlogListParams): Promise<Blog[]> {
    const response = await apiClient.get<BlogListResponse>(ENDPOINTS.BLOGS, params);
    return Array.isArray(response) ? response : response.data || [];
  }

  async getBlogById(id: string): Promise<Blog> {
    const response = await apiClient.get<BlogResponse>(ENDPOINTS.BLOG_BY_ID(id));
    return response.data || response;
  }

  async createBlog(data: CreateBlogRequest): Promise<Blog> {
    const response = await apiClient.post<BlogResponse>(ENDPOINTS.BLOGS, data);
    return response.data || response;
  }

  async updateBlog(id: string, data: UpdateBlogRequest): Promise<Blog> {
    const response = await apiClient.patch<BlogResponse>(ENDPOINTS.BLOG_BY_ID(id), data);
    return response.data || response;
  }

  async deleteBlog(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.BLOG_BY_ID(id));
  }
}

export const blogService = new BlogService();
export default blogService;