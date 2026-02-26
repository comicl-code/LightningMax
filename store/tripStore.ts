'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TripState {
  // Advance booking checklist — keyed by `${rideId}_${forDate}`
  completedBookings: Record<string, boolean>;
  // User notes per day
  dayNotes: Record<string, string>;
  // Show/hide optional items in itinerary
  showOptional: boolean;

  // Actions
  toggleBookingComplete: (key: string) => void;
  setDayNote: (date: string, note: string) => void;
  toggleShowOptional: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      completedBookings: {},
      dayNotes: {},
      showOptional: true,

      toggleBookingComplete: (key) =>
        set((state) => ({
          completedBookings: {
            ...state.completedBookings,
            [key]: !state.completedBookings[key],
          },
        })),

      setDayNote: (date, note) =>
        set((state) => ({
          dayNotes: { ...state.dayNotes, [date]: note },
        })),

      toggleShowOptional: () =>
        set((state) => ({ showOptional: !state.showOptional })),
    }),
    {
      name: 'wdw-trip-store',
    }
  )
);
