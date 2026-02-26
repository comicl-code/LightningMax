import { ParkId } from './park';

export interface LLSPRecommendation {
  rideId: string;
  rideName: string;
  parkId: ParkId;
  advanceBookDate: string;   // 'YYYY-MM-DD' — 7 days before park day
  bookAtTime: string;        // '07:00 AM ET'
  estimatedPriceLow: number;
  estimatedPriceHigh: number;
  groupTotalLow: number;
  groupTotalHigh: number;
  waitSavedMins: number;
  worthItScore: number;      // 0–10
  groupBookingNote: string;
  isCompleted?: boolean;     // user marks as done
}

export interface AdvanceBookingEntry {
  bookDate: string;          // 'YYYY-MM-DD'
  bookTime: string;          // '07:00 AM ET'
  forDate: string;           // 'YYYY-MM-DD'
  parkId: ParkId;
  parkName: string;
  rideId: string;
  rideName: string;
  isCompleted: boolean;
  urgencyNote: string;
  groupSplitNote: string;
}
