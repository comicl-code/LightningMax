import { RopeDropPlan } from '@/types/itinerary';
import { ParkId } from '@/types/park';
import { PARKS } from '@/data/parks';
import { formatTime12h } from '@/lib/utils/time';
import { ROPE_DROP_CONFIG } from '@/data/ropeDropPriority';

interface Props {
  plan: RopeDropPlan;
  parkId: ParkId;
  hasLLSP: boolean;
}

export function RopeDropCard({ plan, parkId, hasLLSP }: Props) {
  const park = PARKS[parkId];
  const config = ROPE_DROP_CONFIG[parkId];

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: park.color }}>
        <span className="text-2xl">{park.icon}</span>
        <div>
          <h3 className="font-bold text-white text-sm">🏃 Rope Drop Plan — {park.name}</h3>
          <p className="text-white/80 text-xs">Early Entry + Public Open Strategy</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Timeline */}
        <div className="space-y-2">
          <TimelineRow
            time={formatTime12h(plan.arrivalTime)}
            label="Arrive at park entrance"
            sublabel="60 min before public open — head to tapstile area"
            icon="🚗"
            highlight={true}
          />
          <TimelineRow
            time={formatTime12h(plan.earlyEntryTime)}
            label="Early Park Entry begins"
            sublabel="On-site hotel perk — 30 min head start on the public"
            icon="🎟"
            highlight={true}
          />
          {plan.earlyEntryTarget && (
            <TimelineRow
              time={formatTime12h(plan.earlyEntryTime)}
              label={plan.earlyEntryTarget.name}
              sublabel={`Sprint target #1 — expected wait at open: ~${Math.round(plan.earlyEntryTarget.typicalWaitMins.low * 0.3)} min`}
              icon="⭐"
              highlight={false}
            />
          )}
          {plan.publicOpenTarget && (
            <TimelineRow
              time={formatTime12h(park.defaultOpenTime)}
              label={plan.publicOpenTarget.name}
              sublabel={`Sprint target #2 (public open) — expected wait: ~${Math.round(plan.publicOpenTarget.typicalWaitMins.low * 0.4)} min`}
              icon="🎢"
              highlight={false}
            />
          )}
        </div>

        {/* LLSP note */}
        {hasLLSP && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p className="font-semibold text-yellow-800">⚡ LLSP covers top ride</p>
            <p className="text-yellow-700 mt-0.5 text-xs">
              Your pre-booked LLSP means you can rope drop a different ride instead.
              Sprint to the targets above rather than the LLSP ride.
            </p>
          </div>
        )}

        {/* Walking directions */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Walking Directions</p>
          <p className="text-sm text-gray-700">{plan.walkingDirections}</p>
        </div>

        {/* Critical tip */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">⚡ Critical Tip</p>
          <p className="text-sm text-orange-800">{config.criticalTip}</p>
        </div>

        {/* Group note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          👥 {plan.groupNote}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({
  time, label, sublabel, icon, highlight
}: {
  time: string; label: string; sublabel: string; icon: string; highlight: boolean;
}) {
  return (
    <div className={`flex gap-3 items-start p-2 rounded-lg ${highlight ? 'bg-purple-100' : ''}`}>
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-gray-500">{time}</span>
          <span className="font-semibold text-gray-900 text-sm">{label}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}
