// API configuration
const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Graph endpoints
  GRAPHS: {
    ORIGINAL: `${API_BASE_URL}/api/graphs/original`,
    ALPHA_ONE: `${API_BASE_URL}/api/graphs/alpha-one`,
    ALPHA_TWO: `${API_BASE_URL}/api/graphs/alpha-two`,
    ALPHA_THREE: `${API_BASE_URL}/api/graphs/alpha-three`,
    LONGEST_PATH: `${API_BASE_URL}/api/graphs/longest-path`,
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
