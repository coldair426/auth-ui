import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  await params;
  return NextResponse.json({ url: 'http://localhost:3000/settings/connections' });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  await params;
  return NextResponse.json({ ok: true }, { status: 200 });
}
