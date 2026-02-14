/**
 * API Configuration
 * Centralized API endpoint management
 * 
 * Provides consistent API endpoint across all components
 */

// Get backend URL from environment variables
const BACKEND_URL = (() => {
  // Try multiple sources in order of preference
  const url = 
    process.env.REACT_APP_BACKEND_URL ||
    window.ENV?.REACT_APP_BACKEND_URL ||
    localStorage.getItem('backend_url') ||
    'http://localhost:8000';
  
  // Ensure URL doesn't have trailing slash
  return url.replace(/\/$/, '');
})();

// API endpoint for auth and general API calls
export const API_ENDPOINT = `${BACKEND_URL}/api`;

// Export for debugging
export const getApiConfig = () => ({
  backendUrl: BACKEND_URL,
  apiEndpoint: API_ENDPOINT,
  env: process.env.REACT_APP_ENV || 'unknown',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
});

// Debug log in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', getApiConfig());
}

export default API_ENDPOINT;
