export type ParkId = 'magic-kingdom' | 'epcot' | 'hollywood-studios' | 'animal-kingdom';

export interface Park {
  id: ParkId;
  name: string;
  shortName: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  queueTimesId: number;
  themeParksWikiId: string;
  defaultOpenTime: string; // 'HH:MM' ET
  defaultCloseTime: string;
  earlyEntryOpenTime: string; // on-site guests: 30 min before public
  ropeDropArriveBeforeMinutes: number;
  icon: string; // emoji
}
