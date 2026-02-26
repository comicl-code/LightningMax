import { ParkId } from '@/types/park';
import { PARKS } from '@/data/parks';

export function ParkBadge({ parkId, size = 'md' }: { parkId: ParkId; size?: 'sm' | 'md' | 'lg' }) {
  const park = PARKS[parkId];
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold text-white ${sizes[size]}`}
      style={{ backgroundColor: park.color }}>
      {park.icon} {park.shortName}
    </span>
  );
}
