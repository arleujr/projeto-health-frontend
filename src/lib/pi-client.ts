import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o JWT automaticamente antes de cada requisição
api.interceptors.request.use(
  (config) => {
    // Busca o token guardado no momento do login Passwordless
    const token = typeof window !== 'undefined' ? localStorage.getItem('@ProjectHealth:token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para capturar desautenticação automática (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('@ProjectHealth:token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);