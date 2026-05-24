import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  await params;

  const response = NextResponse.json({
    accessToken: 'mock_access_token_abc123',
    needsJoin: false,
    isNewUser: false,
  });

  response.cookies.set('refresh_token', 'mock_refresh_token', {
    path: '/',
    httpOnly: true,
    maxAge: 604800,
  });

  return response;
}
