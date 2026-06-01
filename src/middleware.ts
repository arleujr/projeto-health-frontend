import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Captura o token guardado nos Cookies (melhor prática para middleware Next.js)
  const token = request.cookies.get('@ProjectHealth:token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/plans');

  // Se tentar acessar o dashboard sem token, barra imediatamente e joga pro login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se já estiver logado e tentar ir para o login, joga direto para o dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Define quais rotas o middleware deve vigiar de perto
export const config = {
  matcher: ['/dashboard/:path*', '/plans/:path*', '/login'],
};