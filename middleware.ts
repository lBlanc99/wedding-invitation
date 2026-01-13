import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ambil cookie bernama 'admin_session'
  const session = request.cookies.get('admin_session')

  // Cek apakah user sedang membuka halaman admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Kalau tidak ada session, redirect ke login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Cek apakah user sedang membuka halaman login TAPI sudah login
  if (request.nextUrl.pathname === '/login') {
    if (session) {
      // Langsung lempar ke dashboard
      return NextResponse.redirect(new URL('/admin/events', request.url))
    }
  }

  return NextResponse.next()
}

// Tentukan rute mana saja yang dijaga middleware
export const config = {
  matcher: ['/admin/:path*', '/login'],
}