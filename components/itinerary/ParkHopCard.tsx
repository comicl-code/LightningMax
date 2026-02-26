import { DayPlan } from '@/types/itinerary';
import { PARKS } from '@/data/parks';
import { RopeDropCard } from './RopeDropCard';
import { LLSPGuide } from './LLSPGuide';
import { ItineraryBlockCard } from './ItineraryBlock';
import { GroupCoordCard } from './GroupCoordCard';
import { CrowdLevelBar } from '@/components/park-selector/CrowdLevelBar';
import { formatWait } from '@/lib/utils/format';
import { DATE_LABELS } from '@/data/tripConfig';

export function ParkHopCard({ plan }: { plan: DayPlan }) {
  if (!plan.hopInfo) return null;

  const startPark = PARKS[plan.hopInfo.startParkId];
  const endPark = PARKS[plan.hopInfo.endParkId];

  const morningBlocks = plan.itinerary.filter(b =>
    b.startTime < plan.hopInfo!.recommendedHopTime || b.type === 'lunch'
  );
  const transitBlock = plan.itinerary.find(b => b.type === 'park-hop-transit');
  const afternoonBlocks = plan.itinerary.filter(b =>
    b.startTime >= plan.hopInfo!.recommendedHopTime && b.type !== 'park-hop-transit'
  );

  return (
    <div className="space-y-4">
      {/* Hop day header */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="p-4 bg-gradient-to-r text-white"
          style={{ background: `linear-gradient(135deg, ${startPark.color} 50%, ${endPark.color} 50%)` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{startPark.icon}</span>
              <div>
                <div className="text-xs opacity-80">Morning</div>
                <div className="font-bold">{startPark.shortName}</div>
              </div>
            </div>
            <div className="text-2xl">🔄</div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs opacity-80">Afternoon</div>
                <div className="font-bold">{endPark.shortName}</div>
              </div>
              <span className="text-3xl">{endPark.icon}</span>
            </div>
          </div>
          <p className="text-center mt-2 text-sm font-semibold opacity-90">
            🔄 Park Hop Day — {DATE_LABELS[plan.date]}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-500">Crowd</div>
            <CrowdLevelBar level={plan.crowdLevel} />
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Wait Saved</div>
            <div className="font-bold text-green-600">~{formatWait(plan.estimatedWaitsSaved)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">LLSP Cost</div>
            <div className="font-bold text-yellow-700">${plan.estimatedGroupCostLow.toLocaleString()}+</div>
          </div>
        </div>
      </div>

      {/* Park hop LLSP warning */}
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
        <h3 className="font-bold text-red-800 flex items-center gap-2">
          🚨 Park Hop LLSP Rule
        </h3>
        <p className="text-sm text-red-700 mt-1">
          <strong>Morning park LLSP:</strong> Pre-booked 7 days in advance ✅
        </p>
        <p className="text-sm text-red-700 mt-1">
          <strong>{endPark.name} LLSP:</strong> Cannot be pre-booked — must purchase <strong>day-of once in the park</strong>.
          Park hopping unlocks at <strong>2:00 PM</strong>, but you can enter after 2 PM with a park hopper ticket.
        </p>
        <div className="mt-2 p-2 bg-red-100 rounded-lg text-sm text-red-800 font-semibold">
          ⚡ {plan.hopInfo.llspDayOfNote}
        </div>
      </div>

      {/* Group coordination */}
      <GroupCoordCard />

      {/* ── MORNING SECTION ── */}
      <div className="border-l-4 pl-4" style={{ borderColor: startPark.color }}>
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
          <span className="text-xl">{startPark.icon}</span>
          Morning — {startPark.name}
        </h3>

        <RopeDropCard plan={plan.ropeDropPlan} parkId={plan.hopInfo.startParkId} hasLLSP={plan.llspRecommendations.length > 0} />

        <div className="mt-3">
          <LLSPGuide recommendations={plan.llspRecommendations} date={plan.date} />
        </div>

        <div className="mt-3 space-y-2">
          {morningBlocks.map(block => (
            <ItineraryBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* ── TRANSIT ── */}
      {transitBlock && (
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-teal-400" />
          <div className="relative z-10">
            <ItineraryBlockCard block={transitBlock} />
          </div>
        </div>
      )}

      {/* ── AFTERNOON SECTION ── */}
      <div className="border-l-4 pl-4" style={{ borderColor: endPark.color }}>
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
          <span className="text-xl">{endPark.icon}</span>
          Afternoon — {endPark.name}
        </h3>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <p className="text-sm font-bold text-red-700">⚡ Buy {endPark.name} LLSP immediately upon arrival!</p>
          <p className="text-xs text-red-600 mt-1">
            Open MDE → Lightning Lane → purchase top LLSP ride. Availability decreases quickly in the afternoon.
            Check live pricing in the Live Waits tab.
          </p>
        </div>

        <div className="space-y-2">
          {afternoonBlocks.map(block => (
            <ItineraryBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
