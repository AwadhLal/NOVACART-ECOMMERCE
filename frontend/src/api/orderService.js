import api from './axios';

export const orderService = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post('/api/orders', data),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/api/orders/${id}`),
};
