import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/utils/logger';

// Add specific routes that require authentication
const protectedRoutes = ['/dashboard', '/tasks'];

export async function middleware(req: NextRequest) {
  logger.debug('Middleware', 'Processing request', { path: req.nextUrl.pathname });
  
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                    req.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  logger.debug('Middleware', 'Auth status', {
    isAuth,
    isAuthPage,
    isProtectedRoute,
    path: req.nextUrl.pathname
  });

  // Always allow API routes and static files
  if (req.nextUrl.pathname.startsWith('/api') || 
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname === '/favicon.ico') {
    logger.debug('Middleware', 'Allowing API/static route', { path: req.nextUrl.pathname });
    return NextResponse.next();
  }

  // Force unauthenticated access to auth pages
  if (!isAuth && isAuthPage) {
    logger.debug('Middleware', 'Allowing access to auth page', { path: req.nextUrl.pathname });
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    logger.info('Middleware', 'Redirecting authenticated user from auth page', {
      from: req.nextUrl.pathname,
      to: '/dashboard'
    });
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect authenticated users from home page to dashboard
  if (isAuth && req.nextUrl.pathname === '/') {
    logger.info('Middleware', 'Redirecting authenticated user from home', {
      from: req.nextUrl.pathname,
      to: '/dashboard'
    });
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to login page if they try to access protected routes
  if (!isAuth && isProtectedRoute) {
    logger.info('Middleware', 'Redirecting unauthenticated user to login', {
      from: req.nextUrl.pathname,
      to: '/login'
    });
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // For all other routes
  logger.debug('Middleware', 'Allowing access to route', { path: req.nextUrl.pathname });
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}; 