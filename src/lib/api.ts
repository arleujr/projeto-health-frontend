import axios from 'axios';

export const api = axios.create({
  // Coloque aqui a URL e a porta onde o seu Back-end Fastify está rodando
  baseURL: 'http://localhost:3333', 
});

// MOTOR DE SEGURANÇA (INTERCEPTOR): 
// Ele pega o Token JWT que você salvou no login do profissional e injeta
// automaticamente no cabeçalho de todas as requisições para o Back-end.
api.interceptors.request.use(
  (config) => {
    // Ajuste '@health:token' para o nome da chave que você usou no seu login
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