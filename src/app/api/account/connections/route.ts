import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { provider: 'naver', connectedAt: '2025-01-15T09:00:00.000Z' },
  ]);
}
