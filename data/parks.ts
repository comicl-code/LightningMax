import { Park, ParkId } from '@/types/park';

export const PARKS: Record<ParkId, Park> = {
  'magic-kingdom': {
    id: 'magic-kingdom',
    name: 'Magic Kingdom',
    shortName: 'MK',
    color: '#005b9f',
    bgClass: 'bg-blue-700',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-700',
    queueTimesId: 6,
    themeParksWikiId: '75ea578a-adc8-4116-a54d-dccb60765ef9',
    defaultOpenTime: '09:00',
    defaultCloseTime: '22:00',
    earlyEntryOpenTime: '08:30',
    ropeDropArriveBeforeMinutes: 60,
    icon: '🏰',
  },
  'epcot': {
    id: 'epcot',
    name: 'EPCOT',
    shortName: 'EP',
    color: '#1d6a96',
    bgClass: 'bg-cyan-700',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-700',
    queueTimesId: 5,
    themeParksWikiId: '47f90d2c-e191-4239-a466-5892ef59a88b',
    defaultOpenTime: '09:00',
    defaultCloseTime: '21:00',
    earlyEntryOpenTime: '08:30',
    ropeDropArriveBeforeMinutes: 50,
    icon: '🌍',
  },
  'hollywood-studios': {
    id: 'hollywood-studios',
    name: 'Hollywood Studios',
    shortName: 'HS',
    color: '#8b2d35',
    bgClass: 'bg-red-800',
    textClass: 'text-red-800',
    borderClass: 'border-red-800',
    queueTimesId: 7,
    themeParksWikiId: '288747d1-8b4f-4a64-867e-ea7c9b27bad8',
    defaultOpenTime: '09:00',
    defaultCloseTime: '21:00',
    earlyEntryOpenTime: '08:30',
    ropeDropArriveBeforeMinutes: 60,
    icon: '🎬',
  },
  'animal-kingdom': {
    id: 'animal-kingdom',
    name: 'Animal Kingdom',
    shortName: 'AK',
    color: '#4a7c3f',
    bgClass: 'bg-green-700',
    textClass: 'text-green-700',
    borderClass: 'border-green-700',
    queueTimesId: 8,
    themeParksWikiId: '1c84a229-8862-4648-9c71-378ddd2c7693',
    defaultOpenTime: '08:00',
    defaultCloseTime: '20:00',
    earlyEntryOpenTime: '07:30',
    ropeDropArriveBeforeMinutes: 60,
    icon: '🦁',
  },
};

export const PARK_LIST = Object.values(PARKS);

export function getPark(id: ParkId): Park {
  return PARKS[id];
}
