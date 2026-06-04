import axios from 'axios';

export const api = axios.create({
  // Se houver variável de ambiente ele usa, se não, aponta direto para o seu Render na nuvem
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://projeto-health.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper para ler os cookies no lado do cliente
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// INTERCEPTOR DE REQUISIÇÃO: Injeta o token e faz o Log de Debug
api.interceptors.request.use(
  (config) => {
    // Pegando o cookie correto que seu sistema já usa
    const token = getCookie('@ProjectHealth:token');
    
    // Logs vitais para você ver o que está acontecendo no F12
    console.log(`🚀 [AXIOS] Acessando rota: ${config.baseURL}${config.url}`);
    console.log(`🔑 [AXIOS] Token extraído:`, token ? `${token.substring(0, 15)}...` : 'NENHUM TOKEN ENCONTRADO');

    if (token && config.headers) {
      // Remove aspas duplas acidentais que cookies às vezes ganham
      const cleanToken = token.replace(/^"|"$/g, ''); 
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPOSTA: Trata sessão expirada (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se der 401 no dashboard, deixa a página tratar
    if (error.config?.url?.includes('/v1/plans/dashboard')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Limpa o cookie expirado e manda pro login
        document.cookie = "@ProjectHealth:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);