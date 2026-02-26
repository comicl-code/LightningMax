import { ParkId } from './park';

export type LLType = 'LLSP' | 'STANDBY_ONLY';

export interface Ride {
  id: string;
  parkId: ParkId;
  name: string;
  land: string;
  llType: LLType;
  ropeDropPriority: number | null; // 1 = first sprint, null = skip rope drop
  typicalWaitMins: {
    low: number;   // slow day
    high: number;  // spring break
    peak: number;  // worst-case spring break
  };
  durationMins: number; // ride + load/unload
  minHeightInches: number | null;
  thrill: 'low' | 'medium' | 'high';
  groupFriendly: boolean;
  notes: string;
  queueTimesRideId: number | null;
  wikiEntityId: string | null;
}

export interface LiveWaitTime {
  queueTimesId: number;
  rideId: string;
  name: string;
  waitMins: number;
  isOpen: boolean;
  lastUpdated: string;
  land: string;
  llspState?: 'AVAILABLE' | 'FINISHED' | null;
  llspPrice?: string | null;
}
