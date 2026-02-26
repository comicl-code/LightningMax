# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs TypeScript check)
npm run start    # Serve the production build
```

TypeScript errors surface during `npm run build` — there is no separate `tsc` or lint script.

## Architecture

This is a Next.js App Router app (TypeScript + Tailwind CSS 4) that generates optimized Disney World trip itineraries for a specific 6-day trip (March 15–20, 2026, group of 15, on-site hotel, LLSP-only strategy).

### Dependency hierarchy (nothing imports from layers above it)

```
types/            ← base interfaces only, no internal imports
data/             ← static trip constants, imports from types/
lib/utils/        ← pure helpers (time math, display formatting)
lib/api/          ← external API clients (server-side fetch)
lib/optimization/ ← planning algorithms, imports from data/ + utils/
hooks/            ← SWR polling hooks ('use client'), call /api/ routes
store/            ← Zustand persisted state ('use client')
components/       ← React components, import from all of the above
app/              ← Next.js pages + API routes
```

### Two data pipelines

**Static pipeline (server-rendered):**
`data/` → `lib/optimization/itineraryBuilder.ts` → `buildDayPlan(date)` → page server components

`buildDayPlan()` is the main entry point. It reads `CONFIRMED_PARKS[date]` from `data/tripConfig.ts` to determine the park, then orchestrates `buildRopeDropPlan()`, `buildLLSPPlan()`, and `buildParkHopInfo()` into a `DayPlan` object consumed directly by `app/day/[date]/page.tsx`.

**Live pipeline (client-side SWR):**
`lib/api/queueTimes.ts` + `lib/api/themeParksWiki.ts` → `/app/api/` proxy routes (5-min `revalidate`) → `hooks/useWaitTimes.ts` (SWR, 5-min poll) → `WaitTimeDashboard`

The proxy routes exist to avoid CORS and to add server-side caching. Live wait data is merged onto the static ride catalog from `data/rides.ts` using `queueTimesRideId` with name fuzzy-match fallback.

### Key files to understand before making changes

| What you want to change | File(s) to read first |
|---|---|
| Trip dates, parks, group size | `data/tripConfig.ts` |
| Ride catalog (waits, rope drop priority, LLSP flags) | `data/rides.ts` |
| LLSP prices and 7-day advance booking schedule | `data/llspRides.ts` |
| Rope drop directions and strategy per park | `data/ropeDropPriority.ts` |
| Crowd level predictions | `data/crowdCalendar.ts` |
| How the day schedule is assembled | `lib/optimization/itineraryBuilder.ts` |
| LLSP worth-it scoring formula | `lib/optimization/llspStrategy.ts` |
| Park hop start-park scoring | `lib/optimization/parkHopStrategy.ts` |
| Booking countdown logic | `lib/optimization/bookingCalendar.ts` |
| User's persistent state (checked-off bookings) | `store/tripStore.ts` |

### Server vs. client components

All page-level components and most feature components are server components. Mark a component `'use client'` only if it uses SWR hooks, Zustand, or `usePathname`. Current client components: `TripNav`, `WaitTimeDashboard`, `AdvanceBookingChecklist`, `hooks/useWaitTimes.ts`, `store/tripStore.ts`.

### Path alias

`@/*` resolves from the project root. Use `@/data/parks`, `@/lib/utils/time`, etc.

### Date-keyed records pattern

Per-day lookups use `'YYYY-MM-DD'` string keys throughout (`CONFIRMED_PARKS`, `CROWD_CALENDAR`, `DATE_LABELS`, Zustand state). Hop days are identified by `CONFIRMED_PARKS[date]` returning a string starting with `'hop-'`.

### External APIs

- **Queue-Times.com** — `https://queue-times.com/parks/{id}/queue_times.json`. Park IDs: MK=6, EP=5, HS=7, AK=8. Attribution text "Powered by Queue-Times.com" must remain visible in the UI per their terms.
- **ThemeParks.wiki** — `https://api.themeparks.wiki/v1/entity/{uuid}/live`. Park UUIDs are in `data/parks.ts`. Returns `PAID_RETURN_TIME.state` = `'AVAILABLE'` or `'FINISHED'` (sold out) for LLSP rides.
