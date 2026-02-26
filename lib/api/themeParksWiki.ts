import { ParkId } from '@/types/park';
import { PARKS } from '@/data/parks';

interface WikiQueue {
  STANDBY?: { waitTime: number };
  PAID_RETURN_TIME?: {
    price?: { amount: number; currency: string; formatted: string };
    state?: string;
    returnStart?: string | null;
    returnEnd?: string | null;
  };
}

interface WikiAttraction {
  id: string;
  name: string;
  status: string;
  queue?: WikiQueue;
}

interface WikiLiveResponse {
  liveData: WikiAttraction[];
}

export interface LLSPLiveData {
  rideId: string;
  name: string;
  state: 'AVAILABLE' | 'FINISHED' | 'UNKNOWN';
  price: string | null;
  returnStart: string | null;
}

export async function fetchLLSPData(parkId: ParkId): Promise<LLSPLiveData[]> {
  const park = PARKS[parkId];
  const url = `https://api.themeparks.wiki/v1/entity/${park.themeParksWikiId}/live`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`ThemeParks.wiki API error: ${res.status}`);
  }

  const data: WikiLiveResponse = await res.json();

  return data.liveData
    .filter(a => a.queue?.PAID_RETURN_TIME)
    .map(a => ({
      rideId: a.id,
      name: a.name,
      state:
        a.queue?.PAID_RETURN_TIME?.state === 'FINISHED'
          ? 'FINISHED'
          : a.queue?.PAID_RETURN_TIME?.state === 'AVAILABLE'
          ? 'AVAILABLE'
          : 'UNKNOWN',
      price: a.queue?.PAID_RETURN_TIME?.price?.formatted ?? null,
      returnStart: a.queue?.PAID_RETURN_TIME?.returnStart ?? null,
    }));
}
