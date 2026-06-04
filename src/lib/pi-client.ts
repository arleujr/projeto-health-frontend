import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to read cookies on client side
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Request interceptor: injects token from cookies
api.interceptors.request.use(
  (config) => {
    const token = getCookie('@ProjectHealth:token');
    
    // 👇 CRITICAL LOGS to debug what is being sent to backend 👇
    console.log(`🚀 [AXIOS] Trying to access route: ${config.baseURL}${config.url}`);
    console.log(`🔑 [AXIOS] Token extracted from cookie:`, token ? `${token.substring(0, 15)}...` : 'NO TOKEN FOUND');

    if (token && config.headers) {
      // Clean accidental double quotes around token (common cookie issue)
      const cleanToken = token.replace(/^"|"$/g, ''); 
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles expired session (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a 401 on dashboard route, let the page catch it and handle with mock
    if (error.config?.url?.includes('/v1/plans/dashboard')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear expired cookie and redirect to login
        document.cookie = "@ProjectHealth:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
