import { NextRequest, NextResponse } from 'next/server';
import { ParkId } from '@/types/park';
import { fetchQueueTimes } from '@/lib/api/queueTimes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkId: string }> }
) {
  const { parkId } = await params;

  try {
    const data = await fetchQueueTimes(parkId as ParkId);
    return NextResponse.json({
      data,
      attribution: 'Wait time data provided by Queue-Times.com',
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Queue-Times fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch wait times', data: [] },
      { status: 500 }
    );
  }
}
