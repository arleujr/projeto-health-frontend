import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Extracts the cookie dynamically during the request lifecycle
  const token = request.cookies.get('@ProjectHealth:token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Rule 1: Guarding private routes - No token means instant bounce to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rule 2: Preventing logged-in users from seeing the login screen again
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configures the middleware to intercept ONLY dashboard navigation paths
export const config = {
  // Protects dashboard page and any sub-route (e.g., /dashboard/patients)
  matcher: ['/dashboard/:path*'],
};
