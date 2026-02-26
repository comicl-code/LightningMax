import { NextRequest, NextResponse } from 'next/server';
import { ParkId } from '@/types/park';
import { fetchLLSPData } from '@/lib/api/themeParksWiki';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkId: string }> }
) {
  const { parkId } = await params;

  try {
    const data = await fetchLLSPData(parkId as ParkId);
    return NextResponse.json({ data, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('ThemeParks.wiki fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch live LLSP data', data: [] },
      { status: 500 }
    );
  }
}
