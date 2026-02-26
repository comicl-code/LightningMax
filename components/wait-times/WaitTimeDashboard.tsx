'use client';
import { ParkId } from '@/types/park';
import { useWaitTimes, useLLSPLiveData } from '@/hooks/useWaitTimes';
import { PARKS } from '@/data/parks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatWait, waitBg } from '@/lib/utils/format';

export function WaitTimeDashboard({ parkId }: { parkId: ParkId }) {
  const { rides, attribution, fetchedAt, isLoading, error } = useWaitTimes(parkId);
  const { llspData } = useLLSPLiveData(parkId);
  const park = PARKS[parkId];

  // Group rides by land
  const byLand = rides.reduce<Record<string, typeof rides>>((acc, r) => {
    if (!acc[r.land]) acc[r.land] = [];
    acc[r.land].push(r);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 gap-3 text-gray-500">
        <LoadingSpinner />
        <span>Loading live wait times…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        ⚠️ Could not load live wait times. Check connection or try again.
        <br />
        <span className="text-xs text-red-500">The park may be closed or the API may be temporarily unavailable.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">● 0–20 min</span>
        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">● 21–45 min</span>
        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">● 46–75 min</span>
        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">● 76+ min</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">● Closed</span>
      </div>

      {/* Lands */}
      {Object.entries(byLand).map(([land, landRides]) => (
        <div key={land} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 text-white text-sm font-bold" style={{ backgroundColor: park.color }}>
            {land}
          </div>
          <div className="divide-y divide-gray-100">
            {landRides.map(ride => {
              const liveWait = ride.liveWaitMins;
              const llsp = llspData.find((l: { name: string; state: string; price: string | null }) =>
                l.name.toLowerCase().includes(ride.name.toLowerCase().slice(0, 10))
              );
              const isOpen = ride.isOpen;

              return (
                <div key={ride.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{ride.name}</div>
                    {ride.llType === 'LLSP' && (
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">⚡ LLSP</span>
                        {llsp && (
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            llsp.state === 'AVAILABLE'
                              ? 'bg-green-100 text-green-700'
                              : llsp.state === 'FINISHED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {llsp.state === 'AVAILABLE' ? `✓ Available ${llsp.price ? `· ${llsp.price}` : ''}` : llsp.state === 'FINISHED' ? '✕ Sold Out' : 'Unknown'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {!isOpen ? (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 font-medium">Closed</span>
                    ) : liveWait !== null ? (
                      <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${waitBg(liveWait)}`}>
                        {formatWait(liveWait)}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-400">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Attribution */}
      {fetchedAt && (
        <div className="text-xs text-gray-400 text-center pt-2">
          {attribution} · Updated {new Date(fetchedAt).toLocaleTimeString()} · Auto-refreshes every 5 min
        </div>
      )}
    </div>
  );
}
