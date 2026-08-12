import { formatTimestampDate, scrapeFreshness } from '@/lib/format';
import type { ScrapeLog } from '@/lib/types';

/**
 * Warns when a cinema's data has stopped refreshing. Without this the failure
 * is invisible: date chips start at today, so a dead scrape just drains days
 * off the end until the list empties — which reads as "no films on" rather
 * than "this is out of date" (CHANGELOG 2.1.6 / 2.1.8).
 */
export function StaleNotice({ lastScrape }: { lastScrape: ScrapeLog | null | undefined }) {
  const { stale, days, age } = scrapeFreshness(lastScrape);
  if (!stale) return null;

  const when =
    days === null
      ? 'This cinema has never refreshed successfully.'
      : `Last refreshed ${formatTimestampDate(lastScrape!.started_at)} — ${age}.`;

  return (
    <div className="stale-notice" role="status">
      <iconify-icon icon="solar:danger-triangle-linear" />
      <div>
        <strong>Showtimes may be out of date.</strong> {when} Some films and times are
        probably missing.
      </div>
    </div>
  );
}
