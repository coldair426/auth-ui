import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const origin = new URL(request.url).origin;
  const callbackUrl = new URL(`/callback/${provider}`, origin);
  callbackUrl.searchParams.set('code', 'mock_code');
  callbackUrl.searchParams.set('state', 'mock_state');

  return NextResponse.json({ url: callbackUrl.toString() });
}
