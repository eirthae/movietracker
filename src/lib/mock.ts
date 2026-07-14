/**
 * Bundled mock data — active when no Supabase env is configured (or ?mock).
 * Films/dates mirror the design mockups and are generated relative to today
 * so the UI always looks alive.
 */
import { todayJst } from './format';
import type { Cinema, FilmWithScreenings, ScrapeLog, Screening } from './types';

/** today+offset as 'YYYY-MM-DD'. */
function d(offset: number): string {
  const base = new Date(`${todayJst()}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + offset);
  return base.toISOString().slice(0, 10);
}

/**
 * Mock mode starts with ZERO cinemas (matching a fresh install); the device's
 * cinema list lives in ct.myCinemas either way. Adding 'utazu' or 'ayagawa'
 * unlocks the bundled sample films; any other id adds an empty cinema.
 */
export function mockCinemaFromRef(ref: { id: string; name: string }, order: number): Cinema {
  const [chain, slug] = ref.id.includes('-')
    ? [ref.id.slice(0, ref.id.indexOf('-')), ref.id.slice(ref.id.indexOf('-') + 1)]
    : ['aeon', ref.id];
  return {
    id: ref.id,
    chain,
    slug,
    name: ref.name,
    schedule_url: '',
    display_order: order,
  };
}

let screeningSeq = 0;
function slots(
  filmId: string,
  days: number[],
  perDay: { language: Screening['language']; times: string[] }[],
): Screening[] {
  const rows: Screening[] = [];
  for (const day of days) {
    for (const p of perDay) {
      rows.push({
        id: `ms-${++screeningSeq}`,
        film_id: filmId,
        date: d(day),
        language: p.language,
        times: p.times,
      });
    }
  }
  return rows;
}

function film(
  f: Omit<FilmWithScreenings, 'screenings' | 'first_seen_at' | 'last_scraped_at' | 'source_url'> & {
    source_url?: string;
  },
  screenings: Screening[],
): FilmWithScreenings {
  return {
    source_url: `https://cinema.aeoncinema.com/wm/${f.cinema_id}/`,
    first_seen_at: d(-6),
    last_scraped_at: new Date().toISOString(),
    ...f,
    screenings,
  };
}

const utazuFilms: FilmWithScreenings[] = [
  film(
    {
      id: 'mf-northern-signal',
      cinema_id: 'utazu',
      source_id: '9000001',
      title: 'ノーザン・シグナル',
      title_original: 'The Northern Signal',
      description:
        "A deep-space relay engineer intercepts a transmission that shouldn't exist, drawing her crew into a silent standoff at the edge of mapped space.",
      poster_url: null,
      duration_min: 128,
      genres: ['Sci-Fi', 'Thriller'],
      cast: ['J. Marlowe', 'D. Okafor', 'S. Reyes'],
      status: 'now_showing',
      run_from: d(-16),
      run_to: d(11),
    },
    slots('mf-northern-signal', [0, 1, 2, 3], [{ language: 'english', times: ['10:00', '13:30', '19:15'] }]),
  ),
  film(
    {
      id: 'mf-harbor-of-kites',
      cinema_id: 'utazu',
      source_id: '9000002',
      title: '凧の港',
      title_original: 'Harbor of Kites',
      description:
        "Two siblings spend a last summer in a seaside town where kites carry messages between the living and the missing. When the youngest finds a kite with no sender, the town's quiet arrangement with the sky begins to unravel.",
      poster_url: null,
      duration_min: 104,
      genres: ['Animation', 'Family'],
      cast: ['M. Hale', 'R. Tanaka', 'L. Brooks', 'A. Ferro'],
      status: 'now_showing',
      run_from: d(-23),
      run_to: d(4),
    },
    slots(
      'mf-harbor-of-kites',
      [0, 1, 2, 3, 4],
      [
        { language: 'japanese', times: ['10:00', '13:30'] },
        { language: 'english', times: ['19:15'] },
      ],
    ),
  ),
  film(
    {
      id: 'mf-gunjo',
      cinema_id: 'utazu',
      source_id: '9000003',
      title: '群青のカルテ',
      title_original: null,
      description: null,
      poster_url: null,
      duration_min: 118,
      genres: [],
      cast: [],
      status: 'now_showing',
      run_from: d(-9),
      run_to: d(18),
    },
    slots('mf-gunjo', [0, 1, 2], [{ language: 'japanese', times: ['11:20', '16:40', '20:05'] }]),
  ),
  film(
    {
      id: 'mf-glasshouse',
      cinema_id: 'utazu',
      source_id: '9000004',
      title: 'グラスハウス・プロトコル',
      title_original: 'Glasshouse Protocol',
      description:
        'A retired negotiator is pulled back for one last exchange inside a building where every wall listens.',
      poster_url: null,
      duration_min: 121,
      genres: ['Action', 'Thriller'],
      cast: ['K. Ademi', 'T. Vaughn'],
      status: 'upcoming',
      run_from: d(26),
      run_to: d(26),
    },
    slots('mf-glasshouse', [26], [{ language: 'english', times: ['19:00'] }]),
  ),
  film(
    {
      id: 'mf-hoshifuru',
      cinema_id: 'utazu',
      source_id: '9000005',
      title: '星降る夜のピアノ',
      title_original: null,
      description: null,
      poster_url: null,
      duration_min: 109,
      genres: [],
      cast: [],
      status: 'upcoming',
      run_from: d(19),
      run_to: d(19),
    },
    slots('mf-hoshifuru', [19], [{ language: 'japanese', times: ['18:30'] }]),
  ),
];

const ayagawaFilms: FilmWithScreenings[] = [
  film(
    {
      id: 'mf-harbor-of-kites-aya',
      cinema_id: 'ayagawa',
      source_id: '9000002',
      title: '凧の港',
      title_original: 'Harbor of Kites',
      description:
        'Two siblings spend a last summer in a seaside town where kites carry messages between the living and the missing.',
      poster_url: null,
      duration_min: 104,
      genres: ['Animation', 'Family'],
      cast: ['M. Hale', 'R. Tanaka', 'L. Brooks'],
      status: 'now_showing',
      run_from: d(-23),
      run_to: d(4),
    },
    slots('mf-harbor-of-kites-aya', [0, 1, 2], [{ language: 'japanese', times: ['09:40', '14:10'] }]),
  ),
  film(
    {
      id: 'mf-gunjo-aya',
      cinema_id: 'ayagawa',
      source_id: '9000003',
      title: '群青のカルテ',
      title_original: null,
      description: null,
      poster_url: null,
      duration_min: 118,
      genres: [],
      cast: [],
      status: 'now_showing',
      run_from: d(-9),
      run_to: d(18),
    },
    slots('mf-gunjo-aya', [0, 1, 2, 3], [{ language: 'japanese', times: ['10:50', '15:20', '19:40'] }]),
  ),
];

export const MOCK_FILMS: FilmWithScreenings[] = [...utazuFilms, ...ayagawaFilms];

function lastMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const back = (day + 6) % 7; // days since Monday
  now.setDate(now.getDate() - back);
  now.setHours(6, 0, 0, 0);
  return now;
}

export function mockScrapeLog(cinemaId: string | null): ScrapeLog {
  const mon = lastMonday();
  return {
    id: `msl-${cinemaId ?? 'all'}`,
    cinema_id: cinemaId,
    started_at: mon.toISOString(),
    finished_at: new Date(mon.getTime() + 40_000).toISOString(),
    status: 'success',
    error_msg: null,
  };
}
