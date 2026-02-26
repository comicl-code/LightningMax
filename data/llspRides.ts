import { ParkId } from '@/types/park';
import { AdvanceBookingEntry } from '@/types/llBooking';
import { TRIP_CONFIG } from './tripConfig';

export interface LLSPRideInfo {
  rideId: string;
  rideName: string;
  parkId: ParkId;
  priceLow: number;
  priceHigh: number;
  advanceBookDate: string;  // YYYY-MM-DD, 7 days before park day
  forDate: string;          // park visit date
  sellsOutByNote: string;
  worthItOnSpringBreak: boolean;
}

export const LLSP_RIDES: LLSPRideInfo[] = [
  {
    rideId: 'tron',
    rideName: 'TRON Lightcycle / Run',
    parkId: 'magic-kingdom',
    priceLow: 14,
    priceHigh: 18,
    advanceBookDate: '2026-03-08',
    forDate: '2026-03-15',
    sellsOutByNote: 'Often sells out by 9–10 AM on spring break days',
    worthItOnSpringBreak: true,
  },
  {
    rideId: 'flight-of-passage',
    rideName: 'Avatar Flight of Passage',
    parkId: 'animal-kingdom',
    priceLow: 16,
    priceHigh: 22,
    advanceBookDate: '2026-03-09',
    forDate: '2026-03-16',
    sellsOutByNote: 'Can sell out within 1–2 hours of park open on spring break',
    worthItOnSpringBreak: true,
  },
  {
    rideId: 'guardians',
    rideName: 'Guardians: Cosmic Rewind',
    parkId: 'epcot',
    priceLow: 16,
    priceHigh: 22,
    advanceBookDate: '2026-03-10',
    forDate: '2026-03-17',
    sellsOutByNote: 'Frequently sold out by 11 AM during spring break',
    worthItOnSpringBreak: true,
  },
  {
    rideId: 'rise',
    rideName: 'Star Wars: Rise of the Resistance',
    parkId: 'hollywood-studios',
    priceLow: 18,
    priceHigh: 25,
    advanceBookDate: '2026-03-11',
    forDate: '2026-03-18',
    sellsOutByNote: 'Highest demand LLSP in all of WDW — may sell out before park open',
    worthItOnSpringBreak: true,
  },
  {
    rideId: 'slinky',
    rideName: 'Slinky Dog Dash',
    parkId: 'hollywood-studios',
    priceLow: 14,
    priceHigh: 18,
    advanceBookDate: '2026-03-11',
    forDate: '2026-03-18',
    sellsOutByNote: 'Often sold out by noon on spring break days',
    worthItOnSpringBreak: true,
  },
  // Hop Day 1 (Mar 19) — start park LLSP booked in advance
  {
    rideId: 'tron',
    rideName: 'TRON Lightcycle / Run (Hop Day)',
    parkId: 'magic-kingdom',
    priceLow: 14,
    priceHigh: 18,
    advanceBookDate: '2026-03-12',
    forDate: '2026-03-19',
    sellsOutByNote: 'Book immediately at 7 AM on Mar 12',
    worthItOnSpringBreak: true,
  },
  // Hop Day 2 (Mar 20) — start park LLSP booked in advance
  {
    rideId: 'guardians',
    rideName: 'Guardians: Cosmic Rewind (Hop Day)',
    parkId: 'epcot',
    priceLow: 16,
    priceHigh: 22,
    advanceBookDate: '2026-03-13',
    forDate: '2026-03-20',
    sellsOutByNote: 'Book immediately at 7 AM on Mar 13',
    worthItOnSpringBreak: true,
  },
];

export function getLLSPForDate(date: string): LLSPRideInfo[] {
  return LLSP_RIDES.filter(r => r.forDate === date);
}

export function getGroupTotal(ride: LLSPRideInfo): { low: number; high: number } {
  return {
    low: ride.priceLow * TRIP_CONFIG.groupSize,
    high: ride.priceHigh * TRIP_CONFIG.groupSize,
  };
}

// The master advance-booking checklist
export const ADVANCE_BOOKING_SCHEDULE: AdvanceBookingEntry[] = [
  {
    bookDate: '2026-03-08',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-15',
    parkId: 'magic-kingdom',
    parkName: 'Magic Kingdom',
    rideId: 'tron',
    rideName: 'TRON Lightcycle / Run',
    isCompleted: false,
    urgencyNote: 'Spring break Sunday — TRON LLSP sells out fast. Have MDE ready at 6:59 AM.',
    groupSplitNote: 'Split 8+7: Party A books 8 guests, Party B books 7 — simultaneously',
  },
  {
    bookDate: '2026-03-09',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-16',
    parkId: 'animal-kingdom',
    parkName: 'Animal Kingdom',
    rideId: 'flight-of-passage',
    rideName: 'Avatar Flight of Passage',
    isCompleted: false,
    urgencyNote: 'FoP LLSP can sell within hours. Book the moment it opens.',
    groupSplitNote: 'Split 8+7: both lead bookers book simultaneously at 7:00 AM sharp',
  },
  {
    bookDate: '2026-03-10',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-17',
    parkId: 'epcot',
    parkName: 'EPCOT',
    rideId: 'guardians',
    rideName: 'Guardians: Cosmic Rewind',
    isCompleted: false,
    urgencyNote: "St. Patrick's Day at EPCOT means extra demand. Don't delay.",
    groupSplitNote: 'Split 8+7: coordinate both lead bookers for same return window',
  },
  {
    bookDate: '2026-03-11',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-18',
    parkId: 'hollywood-studios',
    parkName: 'Hollywood Studios',
    rideId: 'rise',
    rideName: 'Rise of the Resistance + Slinky Dog Dash',
    isCompleted: false,
    urgencyNote: 'Book BOTH Rise and Slinky back-to-back in the same MDE session. Rise is the #1 demanded LLSP in all of WDW.',
    groupSplitNote: 'Buy Rise LLSP first, then immediately Slinky — both for 15 guests (split 8+7)',
  },
  {
    bookDate: '2026-03-12',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-19',
    parkId: 'magic-kingdom',
    parkName: 'Magic Kingdom (Hop Day 1 – morning park)',
    rideId: 'tron',
    rideName: 'TRON Lightcycle / Run',
    isCompleted: false,
    urgencyNote: 'Book LLSP for whichever park you start at. Second park LLSP must be bought day-of after 2 PM.',
    groupSplitNote: 'Split 8+7 as usual. Do NOT pre-book LLSP for the afternoon park.',
  },
  {
    bookDate: '2026-03-13',
    bookTime: '7:00 AM ET',
    forDate: '2026-03-20',
    parkId: 'epcot',
    parkName: 'EPCOT (Hop Day 2 – morning park)',
    rideId: 'guardians',
    rideName: 'Guardians: Cosmic Rewind',
    isCompleted: false,
    urgencyNote: 'Book LLSP for the morning park. Buy afternoon park LLSP after 2 PM in-park.',
    groupSplitNote: 'Split 8+7 as usual. Second park LLSP is a day-of purchase.',
  },
];
