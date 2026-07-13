/** Date/label formatting. All dates are 'YYYY-MM-DD' strings in JST. */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parts(date: string): { y: number; m: number; d: number; dow: number } {
  const y = Number(date.slice(0, 4));
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return { y, m, d, dow: new Date(y, m - 1, d).getDay() };
}

/** '2026-06-23' -> 'Mon 23 Jun' */
export function formatShortDate(date: string): string {
  const { m, d, dow } = parts(date);
  return `${DAYS[dow]} ${d} ${MONTHS[m - 1]}`;
}

/** '2026-06-28' -> 'Sat 28' (date chips) */
export function formatDayChip(date: string): string {
  const { d, dow } = parts(date);
  return `${DAYS[dow]} ${d}`;
}

/** '2026-06-27' -> '27 Jun' */
export function formatDayMonth(date: string): string {
  const { m, d } = parts(date);
  return `${d} ${MONTHS[m - 1]}`;
}

/** Run dates line: '27 Jun – 24 Jul', or 'From 8 Aug' for upcoming films. */
export function formatRun(
  runFrom: string | null,
  runTo: string | null,
  status: 'now_showing' | 'upcoming',
): string | null {
  if (!runFrom) return null;
  if (status === 'upcoming') return `From ${formatDayMonth(runFrom)}`;
  if (runTo && runTo !== runFrom) return `${formatDayMonth(runFrom)} – ${formatDayMonth(runTo)}`;
  return formatDayMonth(runFrom);
}

/** ISO timestamp -> 'Mon 23 Jun' (scrape-log labels). */
export function formatTimestampDate(iso: string): string {
  const d = new Date(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** Today in JST as 'YYYY-MM-DD' (AEON schedules run on Japan time). */
export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
