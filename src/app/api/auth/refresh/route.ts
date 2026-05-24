import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ accessToken: 'mock_refreshed_token_xyz789' });
}
