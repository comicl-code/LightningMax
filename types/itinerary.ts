import { ParkId } from './park';
import { Ride } from './ride';
import { LLSPRecommendation } from './llBooking';

export type ActivityType =
  | 'arrive'
  | 'early-entry'
  | 'rope-drop-ride'
  | 'standby-ride'
  | 'llsp-ride'
  | 'lunch'
  | 'dinner'
  | 'show'
  | 'character-meet'
  | 'break'
  | 'park-hop-transit'
  | 'buy-llsp-reminder';

export interface ItineraryBlock {
  id: string;
  type: ActivityType;
  startTime: string;   // 'HH:MM'
  endTime: string;
  title: string;
  subtitle?: string;
  location?: string;
  notes?: string;
  waitTimeMins?: number;
  priority: 'must-do' | 'recommended' | 'optional';
  rideId?: string;
  llspRideId?: string;
  badge?: string;
}

export interface RopeDropPlan {
  arrivalTime: string;       // 'HH:MM' — 60 min before public open
  earlyEntryTime: string;    // 'HH:MM' — 30 min before public open
  earlyEntryTarget: Ride | null;
  publicOpenTarget: Ride | null;
  walkingDirections: string;
  groupNote: string;
}

export interface ParkHopInfo {
  startParkId: ParkId;
  endParkId: ParkId;
  recommendedHopTime: string;   // 'HH:MM'
  transitMins: number;
  transitNote: string;
  llspAdvanceBookedFor: ParkId;
  llspDayOfNote: string;
}

export interface DayPlan {
  date: string;              // 'YYYY-MM-DD'
  parkId: ParkId;            // primary/start park
  isHopDay: boolean;
  hopInfo?: ParkHopInfo;
  crowdLevel: number;        // 1–10
  arrivalTime: string;
  earlyEntryTime: string;
  ropeDropPlan: RopeDropPlan;
  llspRecommendations: LLSPRecommendation[];
  itinerary: ItineraryBlock[];
  groupNotes: string[];
  estimatedWaitsSaved: number;
  estimatedGroupCostLow: number;
  estimatedGroupCostHigh: number;
}
