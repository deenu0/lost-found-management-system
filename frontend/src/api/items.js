import api from './axios';

export const getItems = (params) => api.get('/items', { params });
export const getItem  = (id) => api.get(`/items/${id}`);
export const getMatches = (id) => api.get(`/items/${id}/matches`);
export const reportItem = (formData) => api.post('/items', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateItem = (id, data) => api.patch(`/items/${id}`, data);