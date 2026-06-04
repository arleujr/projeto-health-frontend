import axios from 'axios';

// Captura a URL da variável de ambiente, ou usa a do Render direto como fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://projeto-health.onrender.com';

export const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use(
  (config) => {
    // Como vi no seu log que você está pegando o token de um cookie, mantenha a lógica que você já usa, ou use o localStorage:
    const token = typeof window !== 'undefined' ? localStorage.getItem('@health:token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);