import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/orders',
  '/checkout',
  '/profile',
  '/settings',
  '/wishlist'
]

// Admin only routes
const adminRoutes = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/users',
  '/admin/settings'
]

// Auth routes (redirect to home if already logged in)
const authRoutes = [
  '/login',
  '/register'
]

// Public routes (accessible to everyone)
const publicRoutes = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/directions',
  '/api/products',
  '/api/auth'
]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated via cookie
  const isAuthenticated = request.cookies.get('auth')?.value === 'true'
  
  // Get user role from cookie (if stored)
  const userRole = request.cookies.get('userRole')?.value || 'customer'
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Check if route is admin only
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route
  )
  
  // Check if route is public API
  const isPublicApi = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Handle authentication for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Handle admin routes
  if (isAdminRoute && (!isAuthenticated || userRole !== 'admin')) {
    // Redirect to home
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }
  
  // Handle auth routes (if already logged in, redirect to home)
  if (isAuthRoute && isAuthenticated) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }
  
  // Handle API routes protection
  if (pathname.startsWith('/api/') && !isPublicApi) {
    // Check if API route requires authentication
    const isProtectedApi = !publicRoutes.some(route => pathname.startsWith(route))
    
    if (isProtectedApi && !isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if admin API
    if (pathname.startsWith('/api/admin') && (!isAuthenticated || userRole !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Add cache control for protected pages
  if (isProtectedRoute || isAdminRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}