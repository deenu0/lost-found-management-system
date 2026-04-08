import axios from 'axios';

// Generate a unique browser session ID per device
function getSessionId() {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('session_id', id);
  }
  return id;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers['X-User-Id'] = getSessionId();
  return config;
});

export default api;