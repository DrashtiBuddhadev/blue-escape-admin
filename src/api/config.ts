// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://72.60.206.231:3000/api/v1',

  // Request timeout in milliseconds
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),

  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  // Enable request/response logging
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || import.meta.env.DEV,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds

  // Cache configuration
  ENABLE_CACHE: false,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// Environment-specific configurations
export const getApiConfig = () => {
  const env = import.meta.env.MODE;

  switch (env) {
    case 'production':
      return {
        ...API_CONFIG,
        BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://72.60.206.231:3000/api/v1',
        ENABLE_LOGGING: false,
        TIMEOUT: 30000, // 30 seconds for production
      };

    case 'staging':
      return {
        ...API_CONFIG,
        BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://72.60.206.231:3000/api/v1',
        ENABLE_LOGGING: true,
        TIMEOUT: 20000, // 20 seconds for staging
      };

    default: // development
      return API_CONFIG;
  }
};

export default getApiConfig();