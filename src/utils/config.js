// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    API_URL: 'http://192.168.1.129:5000/api',
    // Add other development-specific configs here
  },
  
  // Production environment
  production: {
    API_URL: 'https://estatemanage.onrender.com/api',
    // Add other production-specific configs here
  }
};

// Get current environment (you can set this via environment variable)
const ENV = __DEV__ ? 'development' : 'production';

// Export the current environment's configuration
export const config = API_CONFIG[ENV];

// Export individual config values for convenience
export const API_URL = config.API_URL;

// Helper function to get full API URL for a specific endpoint
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Environment detection helper
export const isDevelopment = () => ENV === 'development';
export const isProduction = () => ENV === 'production'; 