# Blue Escape API Client

Centralized API handler using Axios for the Blue Escape Travel Admin Dashboard.

## Features

- **Centralized Configuration**: Environment-specific settings
- **Type Safety**: Full TypeScript support with Swagger-generated types
- **Error Handling**: Consistent error handling across all requests
- **Request/Response Logging**: Configurable logging for development
- **Environment Support**: Development, staging, and production configurations

## Quick Start

```typescript
import { blogService, collectionService, experienceService } from '../api';

// Get all blogs
const blogs = await blogService.getBlogs();

// Get blogs with filters
const filteredBlogs = await blogService.getBlogs({
  region: 'Asia',
  country: 'Thailand'
});

// Create a new blog
const newBlog = await blogService.createBlog({
  title: 'My Travel Experience',
  content: [
    {
      title: 'Introduction',
      content: 'Amazing journey through...'
    }
  ]
});

// Get collections
const collections = await collectionService.getCollections();

// Create collection content
const collectionContent = await collectionService.createCollectionContent({
  collection_id: 'collection-id',
  hero_media: 'https://example.com/hero.jpg',
  about_collection: 'Beautiful destinations...',
  region: 'Asia',
  country: 'Thailand',
  city: 'Bangkok'
});
```

## Available Services

### BlogService
- `getBlogs(params?: BlogListParams)` - Get all blogs with optional filtering
- `getBlogById(id: string)` - Get a specific blog
- `createBlog(data: CreateBlogRequest)` - Create a new blog
- `updateBlog(id: string, data: UpdateBlogRequest)` - Update a blog
- `deleteBlog(id: string)` - Delete a blog

### CollectionService
- `getCollections()` - Get all collections
- `getCollectionById(id: string)` - Get a specific collection
- `createCollection(data: CreateCollectionRequest)` - Create a new collection
- `updateCollection(id: string, data: UpdateCollectionRequest)` - Update a collection
- `deleteCollection(id: string)` - Delete a collection
- `getAllCollectionContents()` - Get all collection contents
- `getCollectionContentById(id: string)` - Get specific collection content
- `getContentsByCollection(collectionId: string)` - Get contents for a collection
- `createCollectionContent(data: CreateCollectionContentRequest)` - Create collection content
- `updateCollectionContent(id: string, data: UpdateCollectionContentRequest)` - Update collection content
- `deleteCollectionContent(id: string)` - Delete collection content

### ExperienceService
- `getExperiences(params?: ExperienceListParams)` - Get all experiences with optional filtering
- `getExperienceById(id: string)` - Get a specific experience
- `createExperience(data: CreateExperienceRequest)` - Create a new experience
- `updateExperience(id: string, data: UpdateExperienceRequest)` - Update an experience
- `deleteExperience(id: string)` - Delete an experience

### HealthService
- `getHealth()` - Check API health status

## Configuration

The API client uses environment variables for configuration:

```env
# .env file
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
REACT_APP_API_TIMEOUT=10000
```

## Error Handling

All API calls return typed errors:

```typescript
try {
  const blogs = await blogService.getBlogs();
} catch (error) {
  // error has type ApiError
  console.error('Error fetching blogs:', error.message);
  console.error('Status code:', error.status);
  console.error('Error data:', error.data);
}
```

## Type Safety

All API calls are fully typed:

```typescript
// TypeScript will enforce the correct structure
const newBlog: CreateBlogRequest = {
  title: 'My Blog',
  content: [
    {
      title: 'Section 1',
      content: 'Content here...'
    }
  ],
  active: true
};

// Returns typed Blog object
const createdBlog: Blog = await blogService.createBlog(newBlog);
```

## API Endpoints

The API follows RESTful conventions:

- **GET** `/api/v1/blogs` - List blogs
- **POST** `/api/v1/blogs` - Create blog
- **GET** `/api/v1/blogs/{id}` - Get blog
- **PATCH** `/api/v1/blogs/{id}` - Update blog
- **DELETE** `/api/v1/blogs/{id}` - Delete blog

- **GET** `/api/v1/collections` - List collections
- **POST** `/api/v1/collections` - Create collection
- **GET** `/api/v1/collections/{id}` - Get collection
- **PATCH** `/api/v1/collections/{id}` - Update collection
- **DELETE** `/api/v1/collections/{id}` - Delete collection

- **POST** `/api/v1/collections/content` - Create collection content
- **GET** `/api/v1/collections/content/all` - List all collection contents
- **GET** `/api/v1/collections/content/{id}` - Get collection content
- **PATCH** `/api/v1/collections/content/{id}` - Update collection content
- **DELETE** `/api/v1/collections/content/{id}` - Delete collection content
- **GET** `/api/v1/collections/{id}/content` - Get contents for a collection

- **GET** `/api/v1/experiences` - List experiences
- **POST** `/api/v1/experiences` - Create experience
- **GET** `/api/v1/experiences/{id}` - Get experience
- **PATCH** `/api/v1/experiences/{id}` - Update experience
- **DELETE** `/api/v1/experiences/{id}` - Delete experience

- **GET** `/api/v1/health` - Health check