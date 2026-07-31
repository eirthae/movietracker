import { describe, expect, it } from 'vitest';

import { formatDayChip, formatDayMonth, formatRun, formatShortDate } from './format';

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
