export const ENDPOINTS = {
  // Health check
  HEALTH: '/health',

  // Blogs
  BLOGS: '/blogs',
  BLOG_BY_ID: (id: string) => `/blogs/${id}`,

  // Collections
  COLLECTIONS: '/collections',
  COLLECTION_BY_ID: (id: string) => `/collections/${id}`,
  COLLECTION_CONTENT: '/collections/content',
  COLLECTION_CONTENT_ALL: '/collections/content/all',
  COLLECTION_CONTENT_BY_ID: (id: string) => `/collections/content/${id}`,
  COLLECTION_CONTENTS_BY_COLLECTION: (id: string) => `/collections/${id}/content`,

  // Experiences
  EXPERIENCES: '/experiences',
  EXPERIENCE_BY_ID: (id: string) => `/experiences/${id}`,
} as const;