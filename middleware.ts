import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the SERVER before any page is loaded.
// It checks for the admin_token cookie on every /admin/* route.
// If the cookie is missing, the user is redirected to /admin/login
// before they ever receive any admin page content.
//
// This is more secure than the client-side check in admin/layout.tsx
// because the page HTML is never sent to unauthenticated users at all.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow the login page itself — otherwise we'd create an infinite redirect loop
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for the auth cookie
  const token = request.cookies.get('admin_token');

  if (!token) {
    // No token — redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    // Pass the original URL so we can redirect back after login (optional enhancement)
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow the request through.
  // The full JWT verification still happens in lib/auth.ts on the server side.
  return NextResponse.next();
}

export const config = {
  // Run this middleware on all /admin routes
  matcher: ['/admin/:path*'],
};
