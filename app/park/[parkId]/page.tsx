import { WaitTimeDashboard } from '@/components/wait-times/WaitTimeDashboard';
import { PARKS, PARK_LIST } from '@/data/parks';
import { ParkId } from '@/types/park';
import Link from 'next/link';

export function generateStaticParams() {
  return PARK_LIST.map(p => ({ parkId: p.id }));
}

export default async function ParkPage({
  params,
}: {
  params: Promise<{ parkId: string }>;
}) {
  const { parkId } = await params;
  const park = PARKS[parkId as ParkId];

  if (!park) {
    return <div className="text-center py-12 text-gray-500">Park not found.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: park.color }}>
          <span className="text-3xl">{park.icon}</span>
          <div>
            <h1 className="text-xl font-bold">{park.name}</h1>
            <p className="text-sm opacity-80">Live wait times · Updates every 5 minutes</p>
          </div>
        </div>
      </div>

      {/* Park switcher */}
      <div className="flex gap-2 flex-wrap">
        {PARK_LIST.map(p => (
          <Link
            key={p.id}
            href={`/park/${p.id}`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              p.id === parkId
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={p.id === parkId ? { backgroundColor: p.color } : {}}
          >
            {p.icon} {p.shortName}
          </Link>
        ))}
      </div>

      {/* Live wait times */}
      <WaitTimeDashboard parkId={parkId as ParkId} />

      <div className="text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to trip overview</Link>
      </div>
    </div>
  );
}
