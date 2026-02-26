import { getCrowdLabel, getCrowdColor } from '@/data/crowdCalendar';

export function CrowdLevelBar({ level }: { level: number }) {
  const filled = Math.min(level, 10);
  const colors = level <= 3 ? 'bg-green-500' : level <= 5 ? 'bg-yellow-400' : level <= 7 ? 'bg-orange-400' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${i < filled ? colors : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${getCrowdColor(level)}`}>
        {level}/10 · {getCrowdLabel(level)}
      </span>
    </div>
  );
}
