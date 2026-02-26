import { ParkId } from '@/types/park';
import { RopeDropPlan } from '@/types/itinerary';
import { PARKS } from '@/data/parks';
import { getRide } from '@/data/rides';
import { ROPE_DROP_CONFIG } from '@/data/ropeDropPriority';
import { subtractMinutes } from '@/lib/utils/time';

export function buildRopeDropPlan(
  parkId: ParkId,
  hasLLSP: boolean,
  hasEarlyEntry: boolean = true
): RopeDropPlan {
  const park = PARKS[parkId];
  const config = ROPE_DROP_CONFIG[parkId];
  const strategy = hasLLSP ? config.withLLSP : config.withoutLLSP;

  const publicOpen = park.defaultOpenTime;
  const earlyEntryTime = hasEarlyEntry ? park.earlyEntryOpenTime : publicOpen;
  const arrivalTime = subtractMinutes(
    hasEarlyEntry ? earlyEntryTime : publicOpen,
    park.ropeDropArriveBeforeMinutes
  );

  const earlyEntryTarget = getRide(strategy.earlyEntryTarget) ?? null;
  const publicOpenTarget = getRide(strategy.publicOpenTarget) ?? null;

  return {
    arrivalTime,
    earlyEntryTime,
    earlyEntryTarget,
    publicOpenTarget,
    walkingDirections: strategy.directions,
    groupNote: config.groupNote,
  };
}
