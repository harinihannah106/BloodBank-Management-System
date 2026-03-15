import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const donorAPI = {
  getProfile: () => API.get('/donor/profile'),
  saveProfile: (data) => API.post('/donor/profile', data),
  toggleAvailability: (available) => API.put('/donor/availability', { available }),
  getHistory: () => API.get('/donor/history'),
  getNotifications: () => API.get('/donor/notifications'),
  respondNotification: (id, accept) => API.put(`/donor/notifications/${id}/respond`, { accept }),
};

export const recipientAPI = {
  createRequest: (data) => API.post('/recipient/request', data),
  getMyRequests: () => API.get('/recipient/requests'),
  getSuggestedDonors: (bloodGroup) => API.get(`/recipient/donors/suggest?bloodGroup=${encodeURIComponent(bloodGroup)}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getDonors: () => API.get('/admin/donors'),
  getRecipients: () => API.get('/admin/recipients'),
  blockUser: (id) => API.put(`/admin/users/${id}/block`),
  unblockUser: (id) => API.put(`/admin/users/${id}/unblock`),
  getRequests: () => API.get('/admin/requests'),
  approveRequest: (id) => API.put(`/admin/requests/${id}/approve`),
  rejectRequest: (id) => API.put(`/admin/requests/${id}/reject`),
  getStock: () => API.get('/admin/stock'),
  updateStock: (bg, units) => API.put(`/admin/stock/${bg}`, { units }),
  initStock: () => API.post('/admin/stock/initialize'),
};

export default API;
