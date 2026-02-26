'use client';
import useSWR from 'swr';
import { ParkId } from '@/types/park';
import { LiveWaitTime } from '@/types/ride';
import { getRidesByPark } from '@/data/rides';

interface WaitTimeResponse {
  data: LiveWaitTime[];
  attribution: string;
  fetchedAt: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useWaitTimes(parkId: ParkId) {
  const { data, error, isLoading } = useSWR<WaitTimeResponse>(
    `/api/wait-times/${parkId}`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60 * 1000,
    }
  );

  const staticRides = getRidesByPark(parkId);

  // Merge live wait times onto our static ride catalog
  const ridesWithLive = staticRides.map(ride => {
    const live = data?.data.find(
      d => d.rideId === ride.id || d.name.toLowerCase().includes(ride.name.toLowerCase().slice(0, 10))
    );
    return {
      ...ride,
      liveWaitMins: live?.waitMins ?? null,
      isOpen: live?.isOpen ?? true,
      lastUpdated: live?.lastUpdated ?? null,
    };
  });

  return {
    rides: ridesWithLive,
    attribution: data?.attribution ?? 'Powered by Queue-Times.com',
    fetchedAt: data?.fetchedAt ?? null,
    isLoading,
    error,
  };
}

export function useLLSPLiveData(parkId: ParkId) {
  const { data, error, isLoading } = useSWR(
    `/api/live-data/${parkId}`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    llspData: data?.data ?? [],
    fetchedAt: data?.fetchedAt ?? null,
    isLoading,
    error,
  };
}
