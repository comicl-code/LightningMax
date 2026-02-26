import { LLSPRecommendation } from '@/types/llBooking';
import { formatWait } from '@/lib/utils/format';

interface Props {
  recommendations: LLSPRecommendation[];
  date: string;
}

export function LLSPGuide({ recommendations, date }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-500">
        No LLSP rides for this day.
      </div>
    );
  }

  const totalLow = recommendations.reduce((s, r) => s + r.groupTotalLow, 0);
  const totalHigh = recommendations.reduce((s, r) => s + r.groupTotalHigh, 0);
  const totalSaved = recommendations.reduce((s, r) => s + r.waitSavedMins, 0);

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-4 py-3">
        <h3 className="font-bold text-white text-sm">⚡ Lightning Lane Single Pass (LLSP) Plan</h3>
        <p className="text-yellow-100 text-xs mt-0.5">
          Pre-booked 7 days in advance · Saves ~{formatWait(totalSaved)} of waiting for your group
        </p>
      </div>

      {/* Group cost summary */}
      <div className="px-4 py-2 bg-yellow-100 flex flex-wrap gap-4 border-b border-yellow-200">
        <div>
          <div className="text-xs text-yellow-700 font-medium">Group Total (15 people)</div>
          <div className="text-lg font-bold text-yellow-900">${totalLow.toLocaleString()}–${totalHigh.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-yellow-700 font-medium">Per Person</div>
          <div className="text-lg font-bold text-yellow-900">
            ${recommendations.reduce((s, r) => s + r.estimatedPriceLow, 0)}–${recommendations.reduce((s, r) => s + r.estimatedPriceHigh, 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-yellow-700 font-medium">Wait Time Saved</div>
          <div className="text-lg font-bold text-green-700">~{formatWait(totalSaved)}</div>
        </div>
      </div>

      {/* Ride list */}
      <div className="divide-y divide-yellow-200">
        {recommendations.map(rec => (
          <div key={rec.rideId + '-' + rec.advanceBookDate} className="px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  ⚡ {rec.rideName}
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                    LLSP
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  Saves ~{formatWait(rec.waitSavedMins)} standby wait
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-gray-900">${rec.estimatedPriceLow}–${rec.estimatedPriceHigh}</div>
                <div className="text-xs text-gray-500">per person</div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-blue-700">
                📅 Book on {rec.advanceBookDate.slice(5).replace('-', '/')} at {rec.bookAtTime}
              </div>
              <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-green-700">
                💰 Group cost: ${rec.groupTotalLow.toLocaleString()}–${rec.groupTotalHigh.toLocaleString()}
              </div>
            </div>

            <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
              👥 {rec.groupBookingNote}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-700">
        ⚠️ LLSP prices are dynamic and set by Disney day-of. Estimates based on typical spring break pricing.
        Actual prices may vary. Check My Disney Experience for current pricing.
      </div>
    </div>
  );
}
