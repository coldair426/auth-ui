import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { message: 'clientId is required', code: 'INVALID_CLIENT' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    clientId,
    name: 'Breadkun',
    logoUrl: '',
    gradientFrom: '#4F46E5',
    gradientTo: '#7C3AED',
    textDark: false,
    allowedModes: ['redirect', 'popup'],
  });
}
