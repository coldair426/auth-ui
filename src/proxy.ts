import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token');

  if (!refreshToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*'],
};
