import { ParkId } from '@/types/park';
import { DayPlan, ItineraryBlock, ActivityType } from '@/types/itinerary';
import { PARKS } from '@/data/parks';
import { getRidesByPark, getRide } from '@/data/rides';
import { getCrowdLevel } from '@/data/crowdCalendar';
import { buildRopeDropPlan } from './ropeDropStrategy';
import { buildLLSPPlan, getTotalGroupCostRange, getTotalWaitSaved } from './llspStrategy';
import { buildParkHopInfo } from './parkHopStrategy';
import { CONFIRMED_PARKS, TRIP_CONFIG } from '@/data/tripConfig';
import { addMinutes } from '@/lib/utils/time';
import { ROPE_DROP_CONFIG } from '@/data/ropeDropPriority';

let blockIdCounter = 0;
function nextId(): string {
  return `block-${++blockIdCounter}`;
}

function makeBlock(
  type: ActivityType,
  startTime: string,
  durationMins: number,
  title: string,
  opts: Partial<ItineraryBlock> = {}
): ItineraryBlock {
  return {
    id: nextId(),
    type,
    startTime,
    endTime: addMinutes(startTime, durationMins),
    title,
    priority: 'recommended',
    ...opts,
  };
}

// Build itinerary for a single-park day
function buildSingleParkItinerary(
  parkId: ParkId,
  date: string,
  hasLLSP: boolean
): ItineraryBlock[] {
  const park = PARKS[parkId];
  const crowdLevel = getCrowdLevel(date, parkId);
  const ropeDropPlan = buildRopeDropPlan(parkId, hasLLSP);
  const llspRecs = buildLLSPPlan(parkId, date);
  const config = ROPE_DROP_CONFIG[parkId];
  const strategy = hasLLSP ? config.withLLSP : config.withoutLLSP;

  const blocks: ItineraryBlock[] = [];

  // Arrival
  blocks.push(makeBlock('arrive', ropeDropPlan.arrivalTime, 0,
    `Arrive at ${park.name} Entrance`,
    { notes: 'Head to the tapstile area. Keep the group together.', priority: 'must-do', subtitle: `60 min before park opens` }
  ));

  // Early Entry
  blocks.push(makeBlock('early-entry', ropeDropPlan.earlyEntryTime, 5,
    `Early Park Entry Begins — ${park.shortName}`,
    { notes: 'On-site hotel perk: 30 min before public open. Tap in as soon as gates open.', priority: 'must-do', subtitle: '30 min before public open' }
  ));

  // Rope drop ride 1
  if (ropeDropPlan.earlyEntryTarget) {
    const ride = ropeDropPlan.earlyEntryTarget;
    const waitAtOpen = Math.round(ride.typicalWaitMins.low * 0.3); // ~30% of normal at open
    blocks.push(makeBlock('rope-drop-ride', ropeDropPlan.earlyEntryTime,
      ride.durationMins + waitAtOpen,
      ride.name,
      {
        notes: ropeDropPlan.walkingDirections,
        waitTimeMins: waitAtOpen,
        priority: 'must-do',
        badge: '🏃 Rope Drop',
        subtitle: `Expected wait: ${waitAtOpen} min at opening`,
        rideId: ride.id,
      }
    ));
  }

  // Rope drop ride 2 (public open)
  const ride2 = getRide(strategy.publicOpenTarget);
  if (ride2) {
    const earlyTime = addMinutes(ropeDropPlan.earlyEntryTime, (ropeDropPlan.earlyEntryTarget?.durationMins ?? 0) + 10 + Math.round((ropeDropPlan.earlyEntryTarget?.typicalWaitMins.low ?? 15) * 0.3));
    const waitAtOpen = Math.round(ride2.typicalWaitMins.low * 0.4);
    blocks.push(makeBlock('rope-drop-ride', earlyTime,
      ride2.durationMins + waitAtOpen,
      ride2.name,
      {
        waitTimeMins: waitAtOpen,
        priority: 'must-do',
        badge: '🏃 Rope Drop #2',
        subtitle: `Expected wait: ${waitAtOpen} min`,
        rideId: ride2.id,
      }
    ));
  }

  // LLSP rides — add a block for each, starting around 10 AM
  let llspStart = park.defaultOpenTime ? addMinutes(park.defaultOpenTime, 60) : '10:00';
  for (const rec of llspRecs) {
    const ride = getRide(rec.rideId);
    if (!ride) continue;
    blocks.push(makeBlock('llsp-ride', llspStart,
      ride.durationMins + 10, // 10 min to walk to Lightning Lane entrance
      ride.name,
      {
        notes: `Use your pre-booked LLSP. Show QR code at Lightning Lane entrance.`,
        badge: '⚡ LLSP',
        priority: 'must-do',
        waitTimeMins: 5,
        subtitle: `Lightning Lane Single Pass (avg standby: ${rec.waitSavedMins} min)`,
        rideId: ride.id,
        llspRideId: ride.id,
      }
    ));
    llspStart = addMinutes(llspStart, ride.durationMins + 25);
  }

  // Standby fillers — mid-morning (pick rides not yet done with waits < 30 min)
  const alreadyPlanned = new Set([
    strategy.earlyEntryTarget,
    strategy.publicOpenTarget,
    ...llspRecs.map(r => r.rideId),
  ]);

  const fillers = getRidesByPark(parkId)
    .filter(r => !alreadyPlanned.has(r.id) && r.llType === 'STANDBY_ONLY')
    .sort((a, b) => a.typicalWaitMins.high - b.typicalWaitMins.high);

  let fillerTime = addMinutes(park.defaultOpenTime, 90);
  for (const filler of fillers.slice(0, 3)) {
    const wait = crowdLevel >= 8 ? filler.typicalWaitMins.high : filler.typicalWaitMins.low;
    blocks.push(makeBlock('standby-ride', fillerTime,
      filler.durationMins + wait,
      filler.name,
      {
        waitTimeMins: wait,
        priority: 'recommended',
        subtitle: `Standby — expected wait: ~${wait} min`,
        badge: '🎢 Standby',
        rideId: filler.id,
      }
    ));
    fillerTime = addMinutes(fillerTime, filler.durationMins + wait + 10);
  }

  // Lunch — 11:15 AM (before noon rush)
  blocks.push(makeBlock('lunch', '11:15', 45,
    'Lunch',
    {
      notes: 'Eat before noon to beat the crowd. Avoid sit-down restaurants 11:30–1:30 PM.',
      priority: 'recommended',
      subtitle: 'Beat the noon rush — eat at 11:15 AM',
    }
  ));

  // Afternoon break — shows, character meets (1–3 PM = peak standby time)
  blocks.push(makeBlock('show', '13:15', 30,
    'Show or Character Meet',
    {
      notes: 'Peak standby hour (1–3 PM). Ideal time for shows, character photos, or relaxing in A/C.',
      priority: 'optional',
      subtitle: 'Peak crowd period — standby waits highest now',
    }
  ));

  // Break
  blocks.push(makeBlock('break', '14:00', 30,
    'Rest / Recharge Break',
    {
      notes: 'Groups of 15 need more breaks than smaller parties. Hydrate and find shade.',
      priority: 'recommended',
    }
  ));

  // Dinner — 5 PM (beat evening surge)
  blocks.push(makeBlock('dinner', '17:00', 60,
    'Dinner',
    {
      notes: 'Eat at 5 PM before the 6–7 PM dinner rush. Waits drop significantly after 5 PM.',
      priority: 'recommended',
      subtitle: 'Early dinner before evening surge',
    }
  ));

  // Evening rides — post-dinner standby waits drop
  const eveningRide = fillers[3];
  if (eveningRide) {
    const wait = Math.round((crowdLevel >= 8 ? eveningRide.typicalWaitMins.high : eveningRide.typicalWaitMins.low) * 0.7);
    blocks.push(makeBlock('standby-ride', '18:15',
      eveningRide.durationMins + wait,
      eveningRide.name,
      {
        waitTimeMins: wait,
        priority: 'recommended',
        badge: '🌙 Evening Standby',
        subtitle: `Standby waits drop after dinner — ~${wait} min expected`,
        rideId: eveningRide.id,
      }
    ));
  }

  // Sort all blocks by start time
  blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return blocks;
}

// Build itinerary for a park hop day
function buildHopDayItinerary(
  startParkId: ParkId,
  endParkId: ParkId,
  date: string,
  hasLLSP: boolean,
  hopTime: string
): ItineraryBlock[] {
  const startPark = PARKS[startParkId];
  const endPark = PARKS[endParkId];
  const crowdLevel = getCrowdLevel(date, startParkId);
  const ropeDropPlan = buildRopeDropPlan(startParkId, hasLLSP);
  const llspRecs = buildLLSPPlan(startParkId, date);
  const config = ROPE_DROP_CONFIG[startParkId];
  const strategy = hasLLSP ? config.withLLSP : config.withoutLLSP;

  const blocks: ItineraryBlock[] = [];

  // Morning at start park (same as single-park but truncated at hopTime)
  blocks.push(makeBlock('arrive', ropeDropPlan.arrivalTime, 0,
    `Arrive at ${startPark.name}`,
    { priority: 'must-do', subtitle: 'Morning park — full rope drop strategy' }
  ));

  blocks.push(makeBlock('early-entry', ropeDropPlan.earlyEntryTime, 5,
    `Early Entry at ${startPark.shortName}`,
    { notes: 'On-site hotel perk.', priority: 'must-do' }
  ));

  if (ropeDropPlan.earlyEntryTarget) {
    const ride = ropeDropPlan.earlyEntryTarget;
    const wait = Math.round(ride.typicalWaitMins.low * 0.3);
    blocks.push(makeBlock('rope-drop-ride', ropeDropPlan.earlyEntryTime,
      ride.durationMins + wait,
      `${ride.name} (${startPark.shortName})`,
      { waitTimeMins: wait, priority: 'must-do', badge: '🏃 Rope Drop', rideId: ride.id }
    ));
  }

  // LLSP at start park
  let llspStart = addMinutes(startPark.defaultOpenTime, 60);
  for (const rec of llspRecs) {
    const ride = getRide(rec.rideId);
    if (!ride) continue;
    blocks.push(makeBlock('llsp-ride', llspStart,
      ride.durationMins + 10,
      `${ride.name} (${startPark.shortName})`,
      { badge: '⚡ LLSP', priority: 'must-do', waitTimeMins: 5, rideId: ride.id }
    ));
    llspStart = addMinutes(llspStart, ride.durationMins + 25);
  }

  // Lunch before hop
  blocks.push(makeBlock('lunch', '11:15', 45,
    `Lunch at ${startPark.shortName}`,
    { notes: 'Eat before hopping. Easier logistics than eating at the second park.', priority: 'recommended' }
  ));

  // Transit
  blocks.push(makeBlock('park-hop-transit', hopTime, 30,
    `🚝 Park Hop: ${startPark.shortName} → ${endPark.shortName}`,
    {
      notes: `Monorail from Magic Kingdom Transportation Center to EPCOT (~15 min). Allow 30 min total. Ensure all 15 guests are together before departing.`,
      priority: 'must-do',
      subtitle: 'Monorail connection — allow 30 minutes total',
    }
  ));

  // LLSP reminder for end park
  blocks.push(makeBlock('buy-llsp-reminder', addMinutes(hopTime, 30), 5,
    `⚡ Buy ${endPark.shortName} LLSP NOW`,
    {
      notes: `Open My Disney Experience immediately after tapping into ${endPark.name}. Buy the top LLSP ride. Availability decreases quickly — don't wait.`,
      priority: 'must-do',
      badge: '🔴 ACTION REQUIRED',
      subtitle: 'Purchase Lightning Lane Single Pass for top ride at this park',
    }
  ));

  // Afternoon at end park
  const afternoonStart = addMinutes(hopTime, 40);
  const endRides = getRidesByPark(endParkId)
    .filter(r => r.ropeDropPriority !== null)
    .sort((a, b) => (a.ropeDropPriority ?? 99) - (b.ropeDropPriority ?? 99));

  let t = afternoonStart;
  for (const ride of endRides.slice(0, 3)) {
    const wait = crowdLevel >= 8 ? ride.typicalWaitMins.high : ride.typicalWaitMins.low;
    blocks.push(makeBlock('standby-ride', t,
      ride.durationMins + wait,
      `${ride.name} (${endPark.shortName})`,
      {
        waitTimeMins: wait,
        priority: 'recommended',
        badge: '🌆 Afternoon',
        rideId: ride.id,
        subtitle: `Afternoon standby — ~${wait} min expected`,
      }
    ));
    t = addMinutes(t, ride.durationMins + wait + 10);
  }

  // Dinner at end park
  blocks.push(makeBlock('dinner', '17:30', 60,
    `Dinner at ${endPark.shortName}`,
    { priority: 'recommended', subtitle: 'Evening meal before park closes' }
  ));

  blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return blocks;
}

export function buildDayPlan(date: string): DayPlan {
  const parkAssignment = CONFIRMED_PARKS[date];
  const isHopDay = typeof parkAssignment === 'string' && parkAssignment.startsWith('hop-');

  if (isHopDay) {
    const hopInfo = buildParkHopInfo(date);
    const { startParkId, endParkId } = hopInfo;
    const crowdLevel = getCrowdLevel(date, startParkId);
    const hasLLSP = true; // user plans LLSP
    const ropeDropPlan = buildRopeDropPlan(startParkId, hasLLSP);
    const llspRecs = buildLLSPPlan(startParkId, date);
    const totals = getTotalGroupCostRange(llspRecs);
    const itinerary = buildHopDayItinerary(startParkId, endParkId, date, hasLLSP, TRIP_CONFIG.hopTime);

    return {
      date,
      parkId: startParkId,
      isHopDay: true,
      hopInfo,
      crowdLevel,
      arrivalTime: ropeDropPlan.arrivalTime,
      earlyEntryTime: ropeDropPlan.earlyEntryTime,
      ropeDropPlan,
      llspRecommendations: llspRecs,
      itinerary,
      groupNotes: [
        `Group of ${TRIP_CONFIG.groupSize}: split into Party A (${TRIP_CONFIG.partyA}) and Party B (${TRIP_CONFIG.partyB}) for LLSP bookings.`,
        'LLSP for the morning park was pre-booked 7 days in advance. LLSP for the afternoon park must be purchased day-of.',
        `Park hopping is allowed starting 2 PM. Purchase ${PARKS[endParkId]?.shortName ?? ''} LLSP as soon as you tap in.`,
      ],
      estimatedWaitsSaved: getTotalWaitSaved(llspRecs),
      estimatedGroupCostLow: totals.low,
      estimatedGroupCostHigh: totals.high,
    };
  }

  // Single-park day
  const parkId = parkAssignment as ParkId;
  const crowdLevel = getCrowdLevel(date, parkId);
  const hasLLSP = true;
  const ropeDropPlan = buildRopeDropPlan(parkId, hasLLSP);
  const llspRecs = buildLLSPPlan(parkId, date);
  const totals = getTotalGroupCostRange(llspRecs);
  const itinerary = buildSingleParkItinerary(parkId, date, hasLLSP);

  return {
    date,
    parkId,
    isHopDay: false,
    crowdLevel,
    arrivalTime: ropeDropPlan.arrivalTime,
    earlyEntryTime: ropeDropPlan.earlyEntryTime,
    ropeDropPlan,
    llspRecommendations: llspRecs,
    itinerary,
    groupNotes: [
      `Group of ${TRIP_CONFIG.groupSize}: split into Party A (${TRIP_CONFIG.partyA}) and Party B (${TRIP_CONFIG.partyB}) for all LLSP bookings.`,
      'Both lead bookers must book simultaneously at 7:00 AM ET to secure the same return window.',
      'Ensure all 15 guests are linked in My Disney Experience before booking.',
    ],
    estimatedWaitsSaved: getTotalWaitSaved(llspRecs),
    estimatedGroupCostLow: totals.low,
    estimatedGroupCostHigh: totals.high,
  };
}

