// middleware.ts (in de root van je project, naast package.json)
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/account']
const PUBLIC_ACCOUNT_PATHS = ['/account/inloggen', '/account/wachtwoord-vergeten', '/scan']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isPublicException = PUBLIC_ACCOUNT_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !isPublicException) {
    const token = request.cookies.get('payload-token')

    if (!token) {
      const loginUrl = new URL('/account/inloggen', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/scan/:path*'],
}
