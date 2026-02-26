import { ParkId } from '@/types/park';
import { ParkHopInfo } from '@/types/itinerary';
import { getCrowdLevel } from '@/data/crowdCalendar';
import { PARKS } from '@/data/parks';

// Score a candidate start park for a hop day
function scoreStartPark(parkId: ParkId, date: string): number {
  const crowd = getCrowdLevel(date, parkId);
  // Lower crowd at start park = better morning
  let score = (10 - crowd) * 2;

  // Animal Kingdom bonus: opens earlier, animals active at dawn
  if (parkId === 'animal-kingdom') score += 3;

  // MK rope drop advantage: TRON is exceptional at Early Entry
  if (parkId === 'magic-kingdom') score += 2;

  // EPCOT: good afternoon park (World Showcase better in afternoon light)
  if (parkId === 'epcot') score -= 1; // slight penalty as start park

  return score;
}

export function recommendHopOrder(
  date: string,
  parkOptions: [ParkId, ParkId]
): [ParkId, ParkId] {
  const [p1, p2] = parkOptions;
  const score1 = scoreStartPark(p1, date);
  const score2 = scoreStartPark(p2, date);
  return score1 >= score2 ? [p1, p2] : [p2, p1];
}

export function buildParkHopInfo(date: string): ParkHopInfo {
  // For the trip, hop days are MK <-> EPCOT
  const options: [ParkId, ParkId] = ['magic-kingdom', 'epcot'];
  const [startPark, endPark] = recommendHopOrder(date, options);

  const startParkData = PARKS[startPark];
  const endParkData = PARKS[endPark];

  const llspRideMap: Record<ParkId, string> = {
    'magic-kingdom': 'TRON Lightcycle / Run',
    'epcot': 'Guardians: Cosmic Rewind',
    'hollywood-studios': 'Rise of the Resistance',
    'animal-kingdom': 'Avatar Flight of Passage',
  };

  return {
    startParkId: startPark,
    endParkId: endPark,
    recommendedHopTime: '13:00',
    transitMins: 30,
    transitNote: `MK ↔ EPCOT via Disney monorail (~15 min ride + walk). Depart ${startParkData.shortName} by 1:00 PM to arrive ${endParkData.shortName} by ~1:30 PM. Buy ${endParkData.shortName} LLSP upon arrival.`,
    llspAdvanceBookedFor: startPark,
    llspDayOfNote: `Once you enter ${endParkData.name}, immediately open My Disney Experience and purchase ${llspRideMap[endPark]} LLSP. Availability may be limited by 1:30–2:00 PM on spring break — buy as soon as you tap in.`,
  };
}
