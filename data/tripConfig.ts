import { ParkId } from '@/types/park';

export const TRIP_CONFIG = {
  groupSize: 15,
  partyA: 8,
  partyB: 7,
  hasOnsiteHotel: true,
  llspOnly: true, // no LLMP purchase
  advanceBookingDaysAhead: 7,
  advanceBookingTimeET: '07:00',
  earlyEntryMinutes: 30,
  startDate: '2026-03-15',
  endDate: '2026-03-20',
  hopTime: '13:00', // recommended park-hop time
  hopTransitMins: 30, // include buffer
} as const;

export const TRIP_DATES = [
  '2026-03-15',
  '2026-03-16',
  '2026-03-17',
  '2026-03-18',
  '2026-03-19',
  '2026-03-20',
] as const;

export type TripDate = typeof TRIP_DATES[number];

// Confirmed park assignments (fixed by user)
export const CONFIRMED_PARKS: Record<string, ParkId | 'hop-mk-ep' | 'hop-ep-mk'> = {
  '2026-03-15': 'magic-kingdom',
  '2026-03-16': 'animal-kingdom',
  '2026-03-17': 'epcot',
  '2026-03-18': 'hollywood-studios',
  '2026-03-19': 'hop-mk-ep', // app recommends start park
  '2026-03-20': 'hop-ep-mk', // app recommends start park
};

export const HOP_PARKS: Record<string, { option1: [ParkId, ParkId]; option2: [ParkId, ParkId] }> = {
  '2026-03-19': {
    option1: ['magic-kingdom', 'epcot'],
    option2: ['epcot', 'magic-kingdom'],
  },
  '2026-03-20': {
    option1: ['epcot', 'magic-kingdom'],
    option2: ['magic-kingdom', 'epcot'],
  },
};

export const DATE_LABELS: Record<string, string> = {
  '2026-03-15': 'Sun, Mar 15',
  '2026-03-16': 'Mon, Mar 16',
  '2026-03-17': 'Tue, Mar 17 🍀',
  '2026-03-18': 'Wed, Mar 18',
  '2026-03-19': 'Thu, Mar 19',
  '2026-03-20': 'Fri, Mar 20',
};

export const DATE_EVENTS: Record<string, string> = {
  '2026-03-17': "St. Patrick's Day – EPCOT Flower & Garden Festival",
  '2026-03-19': 'Park Hop Day',
  '2026-03-20': 'Park Hop Day',
};
