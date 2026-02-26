import { buildDayPlan } from '@/lib/optimization/itineraryBuilder';
import { TRIP_DATES } from '@/data/tripConfig';
import { DailyItinerary } from '@/components/itinerary/DailyItinerary';
import { ParkHopCard } from '@/components/itinerary/ParkHopCard';
import Link from 'next/link';

export function generateStaticParams() {
  return TRIP_DATES.map(date => ({ date }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  // Validate date is in our trip
  if (!(TRIP_DATES as readonly string[]).includes(date)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No itinerary found for {date}.</p>
        <Link href="/" className="text-blue-600 mt-2 inline-block">← Back to trip overview</Link>
      </div>
    );
  }

  const plan = buildDayPlan(date);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Trip Overview</Link>
        <Link href={`/park/${plan.parkId}`} className="text-sm text-blue-600 hover:underline">
          ⏱ Live Wait Times →
        </Link>
      </div>

      {plan.isHopDay ? (
        <ParkHopCard plan={plan} />
      ) : (
        <DailyItinerary plan={plan} />
      )}
    </div>
  );
}
