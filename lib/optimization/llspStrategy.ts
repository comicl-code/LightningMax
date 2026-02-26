import { ParkId } from '@/types/park';
import { LLSPRecommendation } from '@/types/llBooking';
import { LLSP_RIDES, getGroupTotal } from '@/data/llspRides';
import { getCrowdLevel } from '@/data/crowdCalendar';
import { getRide } from '@/data/rides';
import { TRIP_CONFIG } from '@/data/tripConfig';

export function buildLLSPPlan(parkId: ParkId, date: string): LLSPRecommendation[] {
  const crowdLevel = getCrowdLevel(date, parkId);
  const llspRides = LLSP_RIDES.filter(r => r.forDate === date && r.parkId === parkId);

  return llspRides.map(llsp => {
    const ride = getRide(llsp.rideId);
    const waitSaved =
      crowdLevel >= 9
        ? (ride?.typicalWaitMins.peak ?? 90)
        : crowdLevel >= 7
        ? (ride?.typicalWaitMins.high ?? 60)
        : (ride?.typicalWaitMins.low ?? 30);

    const groupTotals = getGroupTotal(llsp);

    // Score: 10 = absolute must-do, 0 = skip
    const worthItScore = Math.min(10, Math.round((waitSaved / 15) + (crowdLevel - 5)));

    return {
      rideId: llsp.rideId,
      rideName: llsp.rideName,
      parkId: llsp.parkId,
      advanceBookDate: llsp.advanceBookDate,
      bookAtTime: '7:00 AM ET',
      estimatedPriceLow: llsp.priceLow,
      estimatedPriceHigh: llsp.priceHigh,
      groupTotalLow: groupTotals.low,
      groupTotalHigh: groupTotals.high,
      waitSavedMins: waitSaved,
      worthItScore,
      groupBookingNote: `Split group ${TRIP_CONFIG.partyA}+${TRIP_CONFIG.partyB}: both lead bookers book simultaneously at 7:00 AM ET. Aim for the same return window.`,
    };
  });
}

export function getTotalGroupCostRange(
  recs: LLSPRecommendation[]
): { low: number; high: number } {
  return recs.reduce(
    (acc, r) => ({
      low: acc.low + r.groupTotalLow,
      high: acc.high + r.groupTotalHigh,
    }),
    { low: 0, high: 0 }
  );
}

export function getTotalWaitSaved(recs: LLSPRecommendation[]): number {
  return recs.reduce((acc, r) => acc + r.waitSavedMins, 0);
}
