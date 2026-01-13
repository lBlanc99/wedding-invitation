import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'], // Kunci semua folder admin
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    // === SETTING USERNAME & PASSWORD ADMIN DISINI ===
    if (user === 'admin' && pwd === 'wedding2025') {
      return NextResponse.next()
    }
  }

  return new NextResponse('Auth Required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  })
}