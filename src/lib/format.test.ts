import { describe, expect, it } from 'vitest';

import {
  daysSince,
  formatAge,
  formatDayChip,
  formatDayMonth,
  formatRun,
  formatShortDate,
  scrapeFreshness,
  STALE_AFTER_DAYS,
} from './format';

describe('formatShortDate', () => {
  it('formats with weekday, day, month', () => {
    expect(formatShortDate('2026-06-23')).toBe('Tue 23 Jun');
    expect(formatShortDate('2026-07-31')).toBe('Fri 31 Jul');
  });

  it('handles the first of a month and year boundaries', () => {
    expect(formatShortDate('2026-01-01')).toBe('Thu 1 Jan');
    expect(formatShortDate('2026-12-31')).toBe('Thu 31 Dec');
  });
});

describe('formatDayChip', () => {
  it('formats as weekday + day only', () => {
    expect(formatDayChip('2026-06-28')).toBe('Sun 28');
  });
});

describe('formatDayMonth', () => {
  it('formats as day + month', () => {
    expect(formatDayMonth('2026-06-27')).toBe('27 Jun');
  });
});

describe('formatRun', () => {
  it('shows a range for now-showing films', () => {
    expect(formatRun('2026-06-27', '2026-07-24', 'now_showing')).toBe('27 Jun – 24 Jul');
  });

  it('shows "From …" for upcoming films', () => {
    expect(formatRun('2026-08-08', '2026-08-08', 'upcoming')).toBe('From 8 Aug');
  });

  it('collapses a single-day run', () => {
    expect(formatRun('2026-06-27', '2026-06-27', 'now_showing')).toBe('27 Jun');
  });

  it('returns null without a start date', () => {
    expect(formatRun(null, null, 'now_showing')).toBeNull();
  });
});

// The staleness warning is the guard against CHANGELOG 2.1.6 / 2.1.8 — a dead
// scrape silently draining days off the date chips until the list empties.
const NOW = new Date('2026-08-11T06:00:00Z').getTime();
const daysBefore = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

describe('daysSince', () => {
  it('counts whole elapsed days', () => {
    expect(daysSince(daysBefore(0), NOW)).toBe(0);
    expect(daysSince(daysBefore(1), NOW)).toBe(1);
    expect(daysSince(daysBefore(11), NOW)).toBe(11);
  });

  it('floors partial days rather than rounding up', () => {
    expect(daysSince(new Date(NOW - 23 * 3_600_000).toISOString(), NOW)).toBe(0);
    expect(daysSince(new Date(NOW - 25 * 3_600_000).toISOString(), NOW)).toBe(1);
  });

  it('clamps future timestamps to 0 instead of going negative', () => {
    expect(daysSince(daysBefore(-3), NOW)).toBe(0);
  });
});

describe('formatAge', () => {
  it('reads naturally at each boundary', () => {
    expect(formatAge(0)).toBe('today');
    expect(formatAge(1)).toBe('yesterday');
    expect(formatAge(11)).toBe('11 days ago');
  });
});

describe('scrapeFreshness', () => {
  it('stays quiet while the scrape is current', () => {
    expect(scrapeFreshness({ started_at: daysBefore(0) }, NOW).stale).toBe(false);
    expect(scrapeFreshness({ started_at: daysBefore(1) }, NOW).stale).toBe(false);
  });

  it('warns from the threshold onward', () => {
    expect(scrapeFreshness({ started_at: daysBefore(STALE_AFTER_DAYS) }, NOW).stale).toBe(true);
  });

  it('flags the real 11-day AEON outage', () => {
    // Utazu's last success was Jul 31; the app was checked on Aug 11.
    const outage = scrapeFreshness({ started_at: '2026-07-31T02:35:11.687Z' }, NOW);
    expect(outage.stale).toBe(true);
    expect(outage.days).toBe(11);
    expect(outage.age).toBe('11 days ago');
  });

  it('treats a cinema that never scraped as stale', () => {
    expect(scrapeFreshness(null, NOW)).toEqual({ stale: true, days: null, age: 'never' });
    expect(scrapeFreshness(undefined, NOW).stale).toBe(true);
  });
});
