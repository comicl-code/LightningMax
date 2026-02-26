import { ItineraryBlock as IBlock } from '@/types/itinerary';
import { formatTime12h } from '@/lib/utils/time';
import { formatWait, waitBg } from '@/lib/utils/format';

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  'arrive':            { icon: '🚗', color: 'bg-gray-100 border-gray-300' },
  'early-entry':       { icon: '🎟', color: 'bg-purple-100 border-purple-300' },
  'rope-drop-ride':    { icon: '🏃', color: 'bg-purple-50 border-purple-200' },
  'standby-ride':      { icon: '🎢', color: 'bg-blue-50 border-blue-200' },
  'llsp-ride':         { icon: '⚡', color: 'bg-yellow-50 border-yellow-300' },
  'lunch':             { icon: '🍽', color: 'bg-green-50 border-green-200' },
  'dinner':            { icon: '🌮', color: 'bg-green-50 border-green-200' },
  'show':              { icon: '🎭', color: 'bg-pink-50 border-pink-200' },
  'character-meet':    { icon: '✨', color: 'bg-pink-50 border-pink-200' },
  'break':             { icon: '💧', color: 'bg-sky-50 border-sky-200' },
  'park-hop-transit':  { icon: '🚝', color: 'bg-teal-50 border-teal-300' },
  'buy-llsp-reminder': { icon: '🔴', color: 'bg-red-50 border-red-400 border-2' },
};

export function ItineraryBlockCard({ block }: { block: IBlock }) {
  const cfg = TYPE_CONFIG[block.type] ?? { icon: '📌', color: 'bg-white border-gray-200' };

  return (
    <div className={`flex gap-3 p-3 rounded-xl border ${cfg.color}`}>
      {/* Time */}
      <div className="flex-shrink-0 w-14 text-right">
        <span className="text-xs font-mono font-bold text-gray-500">
          {formatTime12h(block.startTime)}
        </span>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 text-lg">{block.badge ? block.badge.split(' ')[0] : cfg.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold text-gray-900 text-sm leading-tight">
            {block.title}
          </div>
          {block.waitTimeMins !== undefined && block.waitTimeMins > 0 && (
            <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${waitBg(block.waitTimeMins)}`}>
              {formatWait(block.waitTimeMins)}
            </span>
          )}
        </div>
        {block.subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{block.subtitle}</p>
        )}
        {block.notes && (
          <p className="text-xs text-gray-600 mt-1 bg-white/60 rounded p-1.5">{block.notes}</p>
        )}
        {block.type === 'buy-llsp-reminder' && (
          <div className="mt-1.5 text-xs font-bold text-red-700 animate-pulse">
            ⚡ Open My Disney Experience NOW → Buy Lightning Lane
          </div>
        )}
      </div>
    </div>
  );
}
