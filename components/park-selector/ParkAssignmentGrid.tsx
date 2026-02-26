import Link from 'next/link';
import { TRIP_DATES, DATE_LABELS, DATE_EVENTS, CONFIRMED_PARKS } from '@/data/tripConfig';
import { PARKS } from '@/data/parks';
import { CROWD_CALENDAR } from '@/data/crowdCalendar';
import { ParkId } from '@/types/park';
import { CrowdLevelBar } from './CrowdLevelBar';
import { Badge } from '@/components/ui/Badge';
import { LLSP_RIDES } from '@/data/llspRides';
import { TRIP_CONFIG } from '@/data/tripConfig';

export function ParkAssignmentGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {TRIP_DATES.map(date => {
        const assignment = CONFIRMED_PARKS[date];
        const isHop = typeof assignment === 'string' && assignment.startsWith('hop-');
        const parkId = isHop ? 'magic-kingdom' : assignment as ParkId;
        const park = PARKS[parkId];
        const crowd = CROWD_CALENDAR[date][parkId];
        const event = DATE_EVENTS[date];
        const llspForDay = LLSP_RIDES.filter(r => r.forDate === date);
        const groupCostLow = llspForDay.reduce((s, r) => s + r.priceLow * TRIP_CONFIG.groupSize, 0);
        const groupCostHigh = llspForDay.reduce((s, r) => s + r.priceHigh * TRIP_CONFIG.groupSize, 0);

        return (
          <Link key={date} href={`/day/${date}`} className="block">
            <div className="rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Park header */}
              <div className="p-3 text-white" style={{ backgroundColor: park.color }}>
                <div className="text-2xl text-center">{park.icon}{isHop ? '🔄' : ''}</div>
                <div className="text-center mt-1">
                  <div className="font-bold text-sm">{isHop ? `${park.shortName}+EP` : park.shortName}</div>
                  <div className="text-xs opacity-80">{DATE_LABELS[date]}</div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2 bg-white">
                <CrowdLevelBar level={crowd} />

                {event && (
                  <div className="text-xs text-purple-700 font-medium bg-purple-50 rounded px-2 py-1">
                    {event}
                  </div>
                )}

                {isHop && (
                  <Badge variant="hop">🔄 Park Hop</Badge>
                )}

                {llspForDay.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-yellow-700">⚡ LLSP:</span>{' '}
                    ${groupCostLow.toLocaleString()}–${groupCostHigh.toLocaleString()} group
                  </div>
                )}

                <div className="text-xs text-blue-600 font-medium">
                  View day plan →
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
