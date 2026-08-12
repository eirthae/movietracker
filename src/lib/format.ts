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

// ── Scrape freshness ─────────────────────────────────────────────────
//
// Stale data is silent by design: date chips start at today, so as a cinema's
// last good scrape recedes its days drain off the end until the list empties.
// Twice now that looked like "the app is broken" rather than "the scrape
// stopped" (see CHANGELOG 2.1.6 / 2.1.8). The scrape runs daily, so anything
// past two days means at least two consecutive failed runs — worth surfacing.

export const STALE_AFTER_DAYS = 2;

/** Whole days elapsed since an ISO timestamp; 0 = within the last 24h. */
export function daysSince(iso: string, now: number = Date.now()): number {
  const elapsed = now - new Date(iso).getTime();
  return elapsed > 0 ? Math.floor(elapsed / 86_400_000) : 0;
}

/** 0 -> 'today', 1 -> 'yesterday', n -> 'N days ago'. */
export function formatAge(days: number): string {
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/**
 * Freshness of a cinema's last *successful* scrape. A null log means one has
 * never succeeded, which is at least as bad as an old one — flag it too.
 */
export function scrapeFreshness(
  lastScrape: { started_at: string } | null | undefined,
  now: number = Date.now(),
): { stale: boolean; days: number | null; age: string } {
  if (!lastScrape) return { stale: true, days: null, age: 'never' };
  const days = daysSince(lastScrape.started_at, now);
  return { stale: days >= STALE_AFTER_DAYS, days, age: formatAge(days) };
}
