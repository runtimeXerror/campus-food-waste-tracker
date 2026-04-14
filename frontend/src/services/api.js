import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Waste Logs ────────────────────────────────────
export const wasteLogAPI = {
  create: (data) => api.post('/waste-logs', data),
  list: (params) => api.get('/waste-logs', { params }),
};

// ─── Dashboard ─────────────────────────────────────
export const dashboardAPI = {
  summary: (params) => api.get('/dashboard/summary', { params }),
  halls: (params) => api.get('/dashboard/halls', { params }),
  categories: (params) => api.get('/dashboard/categories', { params }),
};

// ─── Analytics ─────────────────────────────────────
export const analyticsAPI = {
  trends: (params) => api.get('/analytics/trends', { params }),
  heatmap: (params) => api.get('/analytics/heatmap', { params }),
  reasons: (params) => api.get('/analytics/reasons', { params }),
};

// ─── AI Insights ───────────────────────────────────
export const aiAPI = {
  insights: (params) => api.get('/ai/insights', { params }),
};

// ─── Leaderboard ───────────────────────────────────
export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

export default api;
