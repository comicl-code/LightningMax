import { ParkId } from '@/types/park';

export interface RopeDropConfig {
  withLLSP: {
    earlyEntryTarget: string;   // rideId
    publicOpenTarget: string;   // rideId
    directions: string;
  };
  withoutLLSP: {
    earlyEntryTarget: string;
    publicOpenTarget: string;
    directions: string;
  };
  groupNote: string;
  criticalTip: string;
}

export const ROPE_DROP_CONFIG: Record<ParkId, RopeDropConfig> = {
  'magic-kingdom': {
    withLLSP: {
      // TRON covered by LLSP — sprint to 7DMT instead
      earlyEntryTarget: 'seven-dwarfs',
      publicOpenTarget: 'space-mountain',
      directions:
        'Enter Main Street, walk straight through, turn LEFT at the hub toward Fantasyland. Seven Dwarfs is at the back of Fantasyland. Walk briskly — do not stop for photos on Main Street.',
    },
    withoutLLSP: {
      // No LLSP — sprint to TRON first
      earlyEntryTarget: 'tron',
      publicOpenTarget: 'seven-dwarfs',
      directions:
        'Enter Main Street, bear RIGHT at the hub toward Tomorrowland. TRON is immediately visible. Then cross the park to Fantasyland for Seven Dwarfs.',
    },
    groupNote:
      'Keep all 15 together until through the first ride. Designate a group leader. No bathroom stops until after ride #1.',
    criticalTip:
      'Arrive at the tapstile 60 min before public open. Scan into the park immediately when Early Entry begins at 8:30 AM. The first 10 minutes matter enormously.',
  },

  'animal-kingdom': {
    withLLSP: {
      // FoP covered by LLSP — hit Na'vi River or Everest
      earlyEntryTarget: 'kilimanjaro-safaris',
      publicOpenTarget: 'expedition-everest',
      directions:
        'Head straight through Discovery Island to Africa for Kilimanjaro Safaris (animals most active at 7:30 AM). Then head to Asia for Expedition Everest.',
    },
    withoutLLSP: {
      // Sprint to FoP first — do NOT stop
      earlyEntryTarget: 'flight-of-passage',
      publicOpenTarget: 'navi-river',
      directions:
        'Turn LEFT immediately after entering onto Discovery Island bridge. Follow signs to Pandora. It\'s a 5–7 minute walk to FoP — keep moving. Na\'vi River Journey is right next door.',
    },
    groupNote:
      'AK opens at 8:00 AM — arrive by 7:00 AM. Early Entry (7:30 AM) is huge here. Pandora fills up faster than anywhere else at AK.',
    criticalTip:
      'If buying FoP LLSP, do Kilimanjaro Safaris at 7:30 AM (Early Entry) when animals are most active. This is the best safari experience of the day.',
  },

  'epcot': {
    withLLSP: {
      // Guardians covered — sprint to Test Track or Remy's
      earlyEntryTarget: 'test-track',
      publicOpenTarget: 'remys',
      directions:
        'Enter through the main gate, walk through World Celebration to World Discovery. Test Track is on the right. Then take the path through World Showcase to the France pavilion for Remy\'s.',
    },
    withoutLLSP: {
      // No LLSP — sprint to Guardians
      earlyEntryTarget: 'guardians',
      publicOpenTarget: 'test-track',
      directions:
        'Enter through main gate, head RIGHT toward World Discovery. Guardians is the large purple/blue building. Get in line immediately.',
    },
    groupNote:
      'EPCOT is a large park — keep the group tight during rope drop. St. Patrick\'s Day (Mar 17) means extra crowds near World Showcase. Plan to visit Ireland/UK pavilions later in the day.',
    criticalTip:
      'Guardians LLSP is highly recommended for the EPCOT day — standby waits regularly hit 90–150 min during spring break. Pre-book on Mar 10.',
  },

  'hollywood-studios': {
    withLLSP: {
      // Rise + Slinky covered — sprint to Tower of Terror or Rockin' Roller Coaster
      earlyEntryTarget: 'tower-of-terror',
      publicOpenTarget: 'rockin-roller',
      directions:
        'Enter HS, walk straight down Hollywood Blvd, turn RIGHT onto Sunset Blvd. Tower of Terror is at the end on the right. Rockin\' Roller Coaster is on the left before the Tower.',
    },
    withoutLLSP: {
      // No LLSP — must choose: Rise or Slinky at rope drop
      earlyEntryTarget: 'rise',
      publicOpenTarget: 'tower-of-terror',
      directions:
        'Enter HS and walk straight to Echo Lake, then follow signs to Galaxy\'s Edge. Rise of the Resistance is at the back. Walk fast — this is the most competitive rope drop at WDW.',
    },
    groupNote:
      'HS is the most critical park for LLSP. Both Rise and Slinky are LLSP — if you skip LLSP, lines will be 2–3 hours by 10 AM. STRONGLY recommend buying both LLSP on Mar 11.',
    criticalTip:
      'With both Rise + Slinky LLSP in hand, your rope drop becomes Sunset Blvd (Tower + Rockin\' Roller). These two coasters do 60–75 min standby by 10 AM.',
  },
};
