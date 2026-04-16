import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

function sendFormData(fd) {
  if (fd instanceof FormData) return fd;
  const form = new FormData();
  Object.entries(fd).forEach(([k, v]) => {
    if (v !== null && v !== undefined) {
      form.append(k, typeof v === 'object' && !(v instanceof File) ? JSON.stringify(v) : v);
    }
  });
  return form;
}

export const authApi = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  me: () => api.get('/auth/me/'),
};

export const publicApi = {
  getPages: () => api.get('/pages/'),
  getPage: (slug, lang) => api.get(`/pages/${slug}/`, { params: lang ? { lang } : {} }),
  getSiteSettings: () => api.get('/site-settings/'),
};

export const adminApi = {
  getPages: () => api.get('/admin/pages/'),
  createPage: (data) => api.post('/admin/pages/', data),
  updatePage: (id, data) => api.patch(`/admin/pages/${id}/`, data),
  deletePage: (id) => api.delete(`/admin/pages/${id}/`),

  getSections: (params) => api.get('/admin/sections/', { params }),
  createSection: (data) => api.post('/admin/sections/', sendFormData(data)),
  updateSection: (id, data) => api.patch(`/admin/sections/${id}/`, sendFormData(data)),
  deleteSection: (id) => api.delete(`/admin/sections/${id}/`),
  reorderSection: (id, order) => api.patch(`/admin/sections/${id}/reorder/`, { order }),

  getItems: () => api.get('/admin/items/'),
  createItem: (data) => api.post('/admin/items/', sendFormData(data)),
  updateItem: (id, data) => api.patch(`/admin/items/${id}/`, sendFormData(data)),
  deleteItem: (id) => api.delete(`/admin/items/${id}/`),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/admin/upload/', fd);
  },

  getSiteSettings: () => api.get('/admin/site-settings/'),
  updateSiteSettings: (data) => api.patch('/admin/site-settings/', data),

  getUsers: () => api.get('/admin/users/'),
  createUser: (data) => api.post('/admin/users/', data),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  updateUser: (id, data) => api.patch(`/admin/users/${id}/`, data),
};

export default api;
