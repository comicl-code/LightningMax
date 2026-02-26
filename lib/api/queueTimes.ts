import { ParkId } from '@/types/park';
import { LiveWaitTime } from '@/types/ride';
import { PARKS } from '@/data/parks';
import { RIDES } from '@/data/rides';

interface QueueTimesRide {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated: string;
}

interface QueueTimesLand {
  id: number;
  name: string;
  rides: QueueTimesRide[];
}

interface QueueTimesResponse {
  lands: QueueTimesLand[];
}

function matchRideId(queueTimesId: number, parkId: ParkId): string {
  const matched = RIDES.find(
    r => r.parkId === parkId && r.queueTimesRideId === queueTimesId
  );
  return matched?.id ?? `qt-${queueTimesId}`;
}

export async function fetchQueueTimes(parkId: ParkId): Promise<LiveWaitTime[]> {
  const park = PARKS[parkId];
  const url = `https://queue-times.com/parks/${park.queueTimesId}/queue_times.json`;

  const res = await fetch(url, {
    next: { revalidate: 300 }, // 5-minute cache
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Queue-Times API error: ${res.status}`);
  }

  const data: QueueTimesResponse = await res.json();

  return data.lands.flatMap(land =>
    land.rides.map(ride => ({
      queueTimesId: ride.id,
      rideId: matchRideId(ride.id, parkId),
      name: ride.name,
      waitMins: ride.wait_time,
      isOpen: ride.is_open,
      lastUpdated: ride.last_updated,
      land: land.name,
    }))
  );
}
