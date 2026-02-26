'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TRIP_DATES, DATE_LABELS, CONFIRMED_PARKS } from '@/data/tripConfig';
import { PARKS } from '@/data/parks';
import { ParkId } from '@/types/park';

export function TripNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1 py-2 min-w-max">
          {TRIP_DATES.map(date => {
            const assignment = CONFIRMED_PARKS[date];
            const isHop = typeof assignment === 'string' && assignment.startsWith('hop-');
            const parkId = isHop ? 'magic-kingdom' : assignment as ParkId;
            const park = PARKS[parkId];
            const isActive = pathname === `/day/${date}`;

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-all min-w-[80px] ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: park.color } : {}}
              >
                <span className="text-base">{park.icon}{isHop ? '🔄' : ''}</span>
                <span className="font-semibold mt-0.5">{DATE_LABELS[date].split(',')[0]}</span>
                <span className="opacity-75">{park.shortName}{isHop ? '+' : ''}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
