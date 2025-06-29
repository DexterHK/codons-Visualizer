// API configuration - Dynamic based on environment
const getApiBaseUrl = () => {
  // If we're in development (localhost), use localhost backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For production, check if we're accessing via domain name or IP
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // If accessing via domain (gcat.app), use Nginx proxy (no port needed)
  if (hostname === 'gcat.app') {
    return `${protocol}//${hostname}`;
  }
  
  // If accessing via IP, use direct backend port
  return `${protocol}//${hostname}:5000`;
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Graph endpoints
  GRAPHS: {
    ORIGINAL: `${API_BASE_URL}/api/graphs/original`,
    ALPHA_ONE: `${API_BASE_URL}/api/graphs/alpha-one`,
    ALPHA_TWO: `${API_BASE_URL}/api/graphs/alpha-two`,
    ALPHA_THREE: `${API_BASE_URL}/api/graphs/alpha-three`,
    LONGEST_PATH: `${API_BASE_URL}/api/graphs/longest-path`,
    SHORTEST_PATH: `${API_BASE_URL}/api/graphs/shortest-path`,
  },
  
  // Properties endpoints
  PROPERTIES: {
    ORIGINAL: `${API_BASE_URL}/api/properties/original`,
    ALPHA_ONE: `${API_BASE_URL}/api/properties/alpha-one`,
    ALPHA_TWO: `${API_BASE_URL}/api/properties/alpha-two`,
    ALPHA_THREE: `${API_BASE_URL}/api/properties/alpha-three`,
    C3: `${API_BASE_URL}/api/properties/c3`,
  }
};

export default API_BASE_URL;
