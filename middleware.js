// middleware.js - 
import { NextResponse } from 'next/server'

export async function middleware(request) {
    // Skip tracking for admin routes, API routes, and static files
    if (
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Get visitor data
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Track the visit asynchronously (don't wait for response)
    fetch(`${request.nextUrl.origin}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            path: request.nextUrl.pathname,
            userAgent,
            referer,
            ip,
            timestamp: new Date().toISOString()
        })
    }).catch(() => {}) // Silently fail if tracking fails

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
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}