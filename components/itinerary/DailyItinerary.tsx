import { DayPlan } from '@/types/itinerary';
import { PARKS } from '@/data/parks';
import { RopeDropCard } from './RopeDropCard';
import { LLSPGuide } from './LLSPGuide';
import { ItineraryBlockCard } from './ItineraryBlock';
import { GroupCoordCard } from './GroupCoordCard';
import { CrowdLevelBar } from '@/components/park-selector/CrowdLevelBar';
import { formatWait, formatGroupCost } from '@/lib/utils/format';
import { DATE_LABELS, DATE_EVENTS } from '@/data/tripConfig';

interface Props {
  plan: DayPlan;
}

export function DailyItinerary({ plan }: Props) {
  const park = PARKS[plan.parkId];
  const event = DATE_EVENTS[plan.date];

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="p-4 text-white" style={{ backgroundColor: park.color }}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{park.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{park.name}</h2>
              <p className="opacity-80 text-sm">{DATE_LABELS[plan.date]}</p>
              {event && <p className="text-yellow-200 text-xs mt-0.5">🎉 {event}</p>}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 bg-black/20 rounded-xl p-3">
            <Stat label="Crowd Level" value={<CrowdLevelBar level={plan.crowdLevel} />} />
            <Stat label="Wait Saved" value={<span className="text-green-300 font-bold">~{formatWait(plan.estimatedWaitsSaved)}</span>} />
            <Stat label="LLSP Cost" value={<span className="text-yellow-300 font-bold">${plan.estimatedGroupCostLow.toLocaleString()}–${plan.estimatedGroupCostHigh.toLocaleString()}</span>} />
          </div>
        </div>
      </div>

      {/* Group coordination */}
      <GroupCoordCard />

      {/* Rope drop plan */}
      <RopeDropCard plan={plan.ropeDropPlan} parkId={plan.parkId} hasLLSP={plan.llspRecommendations.length > 0} />

      {/* LLSP guide */}
      <LLSPGuide recommendations={plan.llspRecommendations} date={plan.date} />

      {/* Group notes */}
      {plan.groupNotes.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h3 className="font-bold text-orange-800 text-sm mb-2">📋 Group Notes</h3>
          <ul className="space-y-1">
            {plan.groupNotes.map((note, i) => (
              <li key={i} className="text-sm text-orange-700 flex gap-2">
                <span>•</span><span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full itinerary timeline */}
      <div>
        <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
          🗓 Full Day Schedule
          <span className="text-xs font-normal text-gray-500">Times are estimates — use live wait tab to adjust</span>
        </h3>
        <div className="space-y-2">
          {plan.itinerary.map(block => (
            <ItineraryBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-white/60 text-xs">{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
