import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/student',
  '/faculty', 
  '/admin'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/register'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  )

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    // Check if user is authenticated by looking for user data in cookies
    // or localStorage (we'll use a cookie approach for server-side checking)
    const userCookie = request.cookies.get('user')
    
    if (!userCookie) {
      // Redirect to signin page if not authenticated
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }

    try {
      // Parse user data from cookie
      const userData = JSON.parse(userCookie.value)
      
      // Check if user data is valid
      if (!userData.user_id || !userData.role) {
        // Invalid user data, redirect to signin
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signInUrl)
      }

      // Check role-based access
      if (pathname.startsWith('/student') && userData.role !== 'student') {
        // Redirect to appropriate dashboard based on role
        const redirectUrl = userData.role === 'admin' 
          ? new URL('/admin/sections', request.url)
          : new URL(`/${userData.role}`, request.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      if (pathname.startsWith('/faculty') && userData.role !== 'faculty') {
        const redirectUrl = userData.role === 'admin' 
          ? new URL('/admin/sections', request.url)
          : new URL(`/${userData.role}`, request.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      if (pathname.startsWith('/admin') && userData.role !== 'admin') {
        const redirectUrl = new URL(`/${userData.role}`, request.url)
        return NextResponse.redirect(redirectUrl)
      }

    } catch (error) {
      // Invalid cookie data, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // If user is authenticated and trying to access public auth pages, redirect to dashboard
  if (isPublicRoute && pathname !== '/') {
    const userCookie = request.cookies.get('user')
    
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie.value)
        if (userData.user_id && userData.role) {
          // Redirect to appropriate dashboard
          const dashboardUrl = userData.role === 'admin' 
            ? new URL('/admin/sections', request.url)
            : new URL(`/${userData.role}`, request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch (error) {
        // Invalid cookie, allow access to auth pages
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
