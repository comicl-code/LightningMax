import { AdvanceBookingChecklist } from '@/components/itinerary/AdvanceBookingChecklist';
import { ParkAssignmentGrid } from '@/components/park-selector/ParkAssignmentGrid';
import { GroupCoordCard } from '@/components/itinerary/GroupCoordCard';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-purple-700 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏰✨</span>
          <div>
            <h1 className="text-2xl font-bold">WDW Trip Optimizer</h1>
            <p className="opacity-80 text-sm">March 15–20, 2026 · Group of 15 · On-Site Hotel · LLSP Strategy</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <StatChip icon="🎢" label="Parks" value="4 Parks" />
          <StatChip icon="👥" label="Group" value="15 People" />
          <StatChip icon="⚡" label="Strategy" value="LLSP + Rope Drop" />
          <StatChip icon="🏨" label="Hotel" value="On-Site · Early Entry" />
        </div>
      </div>

      {/* Advance booking checklist — MOST IMPORTANT, bookings start Mar 8 */}
      <section>
        <AdvanceBookingChecklist />
      </section>

      {/* Group coordination */}
      <section>
        <GroupCoordCard />
      </section>

      {/* Trip schedule overview */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">📅 Your 6-Day Schedule</h2>
        <p className="text-sm text-gray-500 mb-3">Click any day to see the full optimized itinerary →</p>
        <ParkAssignmentGrid />
      </section>

      {/* Quick tips */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">💡 Key Strategy Tips</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <TipCard
            icon="⏰"
            title="7-Day Advance LLSP Booking"
            body="Your biggest advantage as an on-site guest. Your first booking is March 8 at 7:00 AM ET for Magic Kingdom (TRON). Have My Disney Experience ready at 6:59 AM."
          />
          <TipCard
            icon="🏃"
            title="Early Park Entry"
            body="30-min Early Park Entry every day — your best free perk. Arrive at the tapstile 60 min before public open. The first 10 minutes after Early Entry begins are critical."
          />
          <TipCard
            icon="🔄"
            title="Park Hop LLSP Rule"
            body="On hop days (Mar 19 & 20), LLSP for the 2nd park CANNOT be pre-booked. Buy it the moment you enter the second park. Availability decreases fast in the afternoon."
          />
          <TipCard
            icon="👥"
            title="Group of 15 Booking Split"
            body="Disney LLSP max is 12 per transaction. Split into Party A (8) + Party B (7). Two lead bookers must purchase simultaneously at 7 AM for the same return window."
          />
        </div>
      </section>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-xl p-3 text-center">
      <div className="text-xl">{icon}</div>
      <div className="text-xs opacity-70 mt-0.5">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}

function TipCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
        <span className="text-xl">{icon}</span> {title}
      </h3>
      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}
