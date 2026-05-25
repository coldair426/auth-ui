import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 보안 설정 (개발 환경 제외)
  if (process.env.NODE_ENV === 'production') {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://hangeul.pstatic.net;
      img-src 'self' blob: data: *;
      font-src 'self' https://hangeul.pstatic.net;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    const response = NextResponse.next();
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // 설정 페이지 접근 제어 추가 로직 (기존 proxy 로직 병합)
    if (pathname.startsWith('/settings')) {
      const refreshToken = request.cookies.get('refresh_token');
      if (!refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return response;
  }

  // 2. 개발 환경 로직
  // 빅테크 프론트엔드 개발 방식: 로컬 개발 환경에서는 백엔드 의존성을 끊고(Decoupling) 
  // 모든 페이지 UI를 확인할 수 있도록 인증 가드를 우회(Bypass)합니다.
  if (pathname.startsWith('/settings')) {
    return NextResponse.next();
  }

  return NextResponse.next();
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
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
