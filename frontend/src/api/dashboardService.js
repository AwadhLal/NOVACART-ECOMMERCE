import api from './axios';

export const dashboardService = {
  getStats: () => api.get('/api/dashboard/stats'),
};
