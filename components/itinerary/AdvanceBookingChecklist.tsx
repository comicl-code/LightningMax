'use client';
import { ADVANCE_BOOKING_SCHEDULE } from '@/data/llspRides';
import { PARKS } from '@/data/parks';
import { useTripStore } from '@/store/tripStore';
import { getBookingCountdown } from '@/lib/optimization/bookingCalendar';
import { isPast } from '@/lib/utils/time';

export function AdvanceBookingChecklist() {
  const { completedBookings, toggleBookingComplete } = useTripStore();

  const upcoming = ADVANCE_BOOKING_SCHEDULE.filter(e => !isPast(e.bookDate));
  const past = ADVANCE_BOOKING_SCHEDULE.filter(e => isPast(e.bookDate));

  return (
    <div className="bg-white rounded-2xl border-2 border-yellow-300 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-3">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          ⚡ 7-Day Advance LLSP Booking Schedule
        </h2>
        <p className="text-yellow-100 text-sm mt-0.5">
          Book these rides 7 days in advance — your biggest planning advantage as an on-site guest
        </p>
      </div>

      {/* Critical note */}
      <div className="bg-red-50 border-b border-red-200 px-4 py-2">
        <p className="text-red-700 text-sm font-medium">
          🚨 <strong>Do NOT pre-book LLSP for the 2nd park on hop days</strong> (Mar 19 & 20).
          Park hopping LLSP must be purchased day-of after 2 PM in the second park.
        </p>
      </div>

      {/* Group split banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <p className="text-blue-800 text-sm">
          👥 <strong>Group of 15:</strong> Split into Party A (8) + Party B (7).
          Two lead bookers must book <strong>simultaneously</strong> at exactly 7:00 AM ET.
          All 15 must be linked in My Disney Experience.
        </p>
      </div>

      {/* Booking items */}
      <div className="divide-y divide-gray-100">
        {ADVANCE_BOOKING_SCHEDULE.map((entry, idx) => {
          const key = `${entry.rideId}_${entry.forDate}`;
          const isCompleted = completedBookings[key] ?? false;
          const isPastDate = isPast(entry.bookDate);
          const countdown = getBookingCountdown(entry.bookDate);
          const park = PARKS[entry.parkId];

          return (
            <div
              key={key}
              className={`px-4 py-4 transition-colors ${isCompleted ? 'bg-green-50' : isPastDate ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleBookingComplete(key)}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {isCompleted && <span className="text-white text-xs">✓</span>}
                </button>

                <div className="flex-1 min-w-0">
                  {/* Row 1: date + park */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">
                      {entry.bookDate.slice(5).replace('-', '/')} at {entry.bookTime}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: park.color }}
                    >
                      {park.icon} {park.shortName}
                    </span>
                    {!isPastDate && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        countdown.urgent
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {countdown.label}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-green-600 font-medium">✅ Booked!</span>
                    )}
                  </div>

                  {/* Row 2: ride name */}
                  <div className="mt-1 font-semibold text-gray-800">
                    ⚡ {entry.rideName}
                    <span className="ml-2 text-gray-500 font-normal text-sm">
                      for {entry.forDate.slice(5).replace('-', '/')}
                    </span>
                  </div>

                  {/* Row 3: urgency note */}
                  {!isCompleted && (
                    <div className="mt-1.5 text-sm text-amber-700 bg-amber-50 rounded px-2 py-1">
                      ⚠️ {entry.urgencyNote}
                    </div>
                  )}

                  {/* Row 4: group note */}
                  <div className="mt-1 text-xs text-blue-600">
                    👥 {entry.groupSplitNote}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
        Tip: Tap a row to mark as booked. All status is saved locally in your browser.
      </div>
    </div>
  );
}
