import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogListParams,
  BlogListResponse,
} from '../types';

class BlogService {
  async getBlogs(params?: BlogListParams): Promise<BlogListResponse> {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
    };
    const response = await apiClient.get<BlogListResponse>(ENDPOINTS.BLOGS, queryParams);
    return response;
  }

  async getActiveBlogs(params?: BlogListParams): Promise<BlogListResponse> {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
      active: true,
    };
    const response = await apiClient.get<BlogListResponse>(ENDPOINTS.BLOGS, queryParams);
    return response;
  }

  async getBlogById(id: string): Promise<Blog> {
    return await apiClient.get<Blog>(ENDPOINTS.BLOG_BY_ID(id));
  }

  async createBlog(data: CreateBlogRequest): Promise<Blog> {
    return await apiClient.post<Blog>(ENDPOINTS.BLOGS, data);
  }

  async updateBlog(id: string, data: UpdateBlogRequest): Promise<Blog> {
    return await apiClient.patch<Blog>(ENDPOINTS.BLOG_BY_ID(id), data);
  }

  async deleteBlog(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.BLOG_BY_ID(id));
  }

}

export const blogService = new BlogService();
export default blogService;