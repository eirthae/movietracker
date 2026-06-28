/** Small formatting helpers (no external date lib needed). */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2026-06-28' -> 'Sat 28 Jun'. Parsed as local date (no TZ shift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[date.getDay()]} ${d} ${MONTHS[m - 1]}`;
}

/** '2026-06-28' -> 'Mon 23 Jun' style short date, or 'Never' for null. */
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  return formatDate(iso.slice(0, 10));
}

/** Run dates: '28 Jun – 18 Jul', or single date, or '' if none. */
export function formatRun(from: string | null, to: string | null): string {
  const f = from ? formatDate(from).replace(/^\w+ /, '') : '';
  const t = to ? formatDate(to).replace(/^\w+ /, '') : '';
  if (f && t) return `${f} – ${t}`;
  return f || t || '';
}

/** Whole days since an ISO timestamp; null if missing. */
export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
}
