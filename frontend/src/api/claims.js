import api from './axios';

export const submitClaim   = (itemId, formData) =>
  api.post(`/claims/${itemId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getItemClaims = (itemId) => api.get(`/claims/item/${itemId}`);