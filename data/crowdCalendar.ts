import { ParkId } from '@/types/park';

// Crowd levels 1–10 sourced from TouringPlans + Undercover Tourist projections
// March 2026 is peak spring break — expect 7–10/10 across all parks
export const CROWD_CALENDAR: Record<string, Record<ParkId, number>> = {
  '2026-03-15': {
    'magic-kingdom': 9,
    'epcot': 7,
    'hollywood-studios': 9,
    'animal-kingdom': 7,
  },
  '2026-03-16': {
    'magic-kingdom': 8,
    'epcot': 7,
    'hollywood-studios': 8,
    'animal-kingdom': 7,
  },
  '2026-03-17': {
    'magic-kingdom': 7,
    'epcot': 9, // St. Patrick's Day — EPCOT surges (Flower & Garden)
    'hollywood-studios': 8,
    'animal-kingdom': 6,
  },
  '2026-03-18': {
    'magic-kingdom': 7,
    'epcot': 6,
    'hollywood-studios': 7,
    'animal-kingdom': 6,
  },
  '2026-03-19': {
    'magic-kingdom': 8,
    'epcot': 7,
    'hollywood-studios': 8,
    'animal-kingdom': 7,
  },
  '2026-03-20': {
    'magic-kingdom': 9,
    'epcot': 8,
    'hollywood-studios': 9,
    'animal-kingdom': 7,
  },
};

export function getCrowdLevel(date: string, parkId: ParkId): number {
  return CROWD_CALENDAR[date]?.[parkId] ?? 7;
}

export function getCrowdLabel(level: number): string {
  if (level <= 3) return 'Low';
  if (level <= 5) return 'Moderate';
  if (level <= 7) return 'High';
  if (level <= 9) return 'Very High';
  return 'Extreme';
}

export function getCrowdColor(level: number): string {
  if (level <= 3) return 'text-green-600';
  if (level <= 5) return 'text-yellow-600';
  if (level <= 7) return 'text-orange-500';
  return 'text-red-600';
}

export function getCrowdBg(level: number): string {
  if (level <= 3) return 'bg-green-100';
  if (level <= 5) return 'bg-yellow-100';
  if (level <= 7) return 'bg-orange-100';
  return 'bg-red-100';
}
