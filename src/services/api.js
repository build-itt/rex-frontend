import axios from 'axios';

const BASE_URL = 'https://rex-backend.vercel.app';

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      if (error.response.status === 401) {
        // Check if we're not already on the sign-in page to prevent redirect loops
        const currentPath = window.location.pathname;
        if (currentPath !== '/signin' && currentPath !== '/signup' && !currentPath.includes('/password/reset')) {
          // Handle unauthorized (could redirect to login)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('balance');
          
          // Use history API instead of location.href to prevent full page reload
          window.history.pushState({}, '', '/signin');
          window.dispatchEvent(new Event('popstate'));
        }
      }
      // Log other errors
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/account/login/', credentials),
  register: (userData) => api.post('/account/register/', userData),
  forgotPassword: (email) => api.post('/account/password/reset/', { email }),
  resetPassword: (data) => api.post('/account/passwordreset/confirm/', data),
};

// Payment services
export const paymentService = {
  getBalance: () => api.get('/pay/balance/'),
  buyItem: (itemId) => api.post(`/pay/buy/${itemId}/`),
  buyBtc: (data) => api.post('/pay/buy-btc/', data),
  getBtcPreview: (params) => api.get('/pay/buy-btc/', { params }),
  getTransactionHistory: () => api.get('/account/history/'),
};

// Banks/Cards services
export const dataService = {
  getBanks: () => api.get('/banks/'),
  getCards: () => api.get('/cards/'),
  getDumps: () => api.get('/dumps/'),
  getPurchaseHistory: () => api.get('/account/history/'),
};

// User data services
export const userService = {
  getProfile: () => api.get('/account/profile/'),
  getPurchaseHistory: () => api.get('/account/history/'),
  getRecentActivity: () => api.get('/account/activity/'),
};

export default api; 