import { AdvanceBookingEntry } from '@/types/llBooking';
import { ADVANCE_BOOKING_SCHEDULE } from '@/data/llspRides';
import { daysUntil, isPast } from '@/lib/utils/time';

export function getBookingSchedule(
  completedBookings: Record<string, boolean>
): AdvanceBookingEntry[] {
  return ADVANCE_BOOKING_SCHEDULE.map(entry => ({
    ...entry,
    isCompleted: completedBookings[entry.rideId + '_' + entry.forDate] ?? false,
  }));
}

export function getNextUpcomingBooking(
  schedule: AdvanceBookingEntry[]
): AdvanceBookingEntry | null {
  const pending = schedule.filter(e => !e.isCompleted && !isPast(e.bookDate));
  if (pending.length === 0) return null;
  return pending.sort((a, b) => a.bookDate.localeCompare(b.bookDate))[0];
}

export function getBookingCountdown(bookDate: string): {
  label: string;
  urgent: boolean;
} {
  const days = daysUntil(bookDate);
  if (days < 0) return { label: 'Passed', urgent: false };
  if (days === 0) return { label: 'TODAY — book at 7:00 AM ET!', urgent: true };
  if (days === 1) return { label: 'TOMORROW at 7:00 AM ET', urgent: true };
  return { label: `In ${days} days`, urgent: days <= 3 };
}
