import { describe, expect, it } from 'vitest';

import { displayTitle, filmLanguage, screeningDates, timesOn } from './queries';
import type { FilmWithScreenings, Screening } from './types';

function film(overrides: Partial<FilmWithScreenings> = {}): FilmWithScreenings {
  return {
    id: 'f1',
    cinema_id: 'utazu',
    source_id: '1000001',
    title: '凧の港',
    title_original: 'Harbor of Kites',
    description: null,
    poster_url: null,
    duration_min: 104,
    genres: [],
    cast: [],
    status: 'now_showing',
    run_from: '2026-07-01',
    run_to: '2026-07-31',
    source_url: null,
    first_seen_at: '2026-07-01',
    last_scraped_at: '2026-07-31T00:00:00Z',
    screenings: [],
    ...overrides,
  };
}

function screening(overrides: Partial<Screening>): Screening {
  return { id: 's1', film_id: 'f1', date: '2026-07-31', language: 'japanese', times: [], ...overrides };
}

describe('filmLanguage', () => {
  it('is english when ANY screening is english (mixed card)', () => {
    const f = film({
      screenings: [
        screening({ language: 'japanese', times: ['10:00'] }),
        screening({ id: 's2', language: 'english', times: ['19:15'] }),
      ],
    });
    expect(filmLanguage(f)).toBe('english');
  });

  it('is japanese for japanese-only films', () => {
    const f = film({ screenings: [screening({ language: 'japanese', times: ['10:00'] })] });
    expect(filmLanguage(f)).toBe('japanese');
  });

  it('is unknown with no screenings', () => {
    expect(filmLanguage(film())).toBe('unknown');
  });
});

describe('displayTitle', () => {
  it('leads with the English title for English films, Japanese as secondary', () => {
    const f = film({ screenings: [screening({ language: 'english', times: ['19:15'] })] });
    expect(displayTitle(f)).toEqual({ primary: 'Harbor of Kites', secondary: '凧の港' });
  });

  it('keeps the Japanese title for Japanese films', () => {
    const f = film({
      title: '群青のカルテ',
      title_original: null,
      screenings: [screening({ language: 'japanese', times: ['10:00'] })],
    });
    expect(displayTitle(f)).toEqual({ primary: '群青のカルテ', secondary: null });
  });
});

describe('screeningDates', () => {
  it('dedupes (one row per language) and sorts ascending', () => {
    const f = film({
      screenings: [
        screening({ date: '2026-08-02', language: 'japanese', times: ['10:00'] }),
        screening({ id: 's2', date: '2026-08-01', language: 'english', times: ['19:15'] }),
        screening({ id: 's3', date: '2026-08-01', language: 'japanese', times: ['13:30'] }),
      ],
    });
    expect(screeningDates(f)).toEqual(['2026-08-01', '2026-08-02']);
  });
});

describe('timesOn', () => {
  it('merges languages for one date and sorts by time', () => {
    const f = film({
      screenings: [
        screening({ date: '2026-08-01', language: 'english', times: ['19:15', '09:30'] }),
        screening({ id: 's2', date: '2026-08-01', language: 'japanese', times: ['13:30'] }),
        screening({ id: 's3', date: '2026-08-02', language: 'japanese', times: ['10:00'] }),
      ],
    });
    expect(timesOn(f, '2026-08-01')).toEqual([
      { time: '09:30', language: 'english' },
      { time: '13:30', language: 'japanese' },
      { time: '19:15', language: 'english' },
    ]);
  });

  it('returns empty for a date with no screenings', () => {
    expect(timesOn(film(), '2026-08-01')).toEqual([]);
  });
});
