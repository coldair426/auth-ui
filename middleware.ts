import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 간단한 JWT 파싱 (서명 검증은 백엔드 담당)
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    // Authorization 헤더나 추가 처리를 위해 응답 헤더에 세팅 가능
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub || payload.userId || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // 파싱 실패 시 로그인으로
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - join (join page)
     * - callback (auth callback pages)
     * - consent (consent page)
     * - policies (policy pages)
     * - error (error pages)
     * - root path (/)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|join|callback|consent|policies|error|$).*)',
  ],
};
