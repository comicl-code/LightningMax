export function formatWait(mins: number): string {
  if (mins === 0) return 'Walk-on';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hr`;
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

export function formatPriceRange(low: number, high: number): string {
  return `$${low}–$${high}`;
}

export function formatGroupCost(low: number, high: number): string {
  return `$${low.toLocaleString()}–$${high.toLocaleString()} for group of 15`;
}

export function waitColor(mins: number): string {
  if (mins === 0) return 'text-gray-500';
  if (mins <= 20) return 'text-green-600';
  if (mins <= 45) return 'text-yellow-600';
  if (mins <= 75) return 'text-orange-500';
  return 'text-red-600';
}

export function waitBg(mins: number): string {
  if (mins === 0) return 'bg-gray-100 text-gray-600';
  if (mins <= 20) return 'bg-green-100 text-green-700';
  if (mins <= 45) return 'bg-yellow-100 text-yellow-700';
  if (mins <= 75) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}
