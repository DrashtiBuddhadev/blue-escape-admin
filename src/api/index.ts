// Central API exports - Import everything you need from here

// API Client and Configuration
export { default as apiClient } from './client';
export { default as apiConfig } from './config';

// Endpoints
export { ENDPOINTS } from './endpoints';

// Services
export {
  blogService,
  collectionService,
  experienceService,
  healthService,
} from './services';

// Types
export * from './types';

// Re-export the main client for convenience
export { default as api } from './client';

// Helper for checking API health
export const checkApiHealth = async () => {
  try {
    const { healthService } = await import('./services');
    return await healthService.getHealth();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};