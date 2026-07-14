/**
 * AEON Cinema adapter.
 *
 * The public schedule pages (cinema.aeoncinema.com/wm/{slug}/) render a JS
 * widget that loads clean JSON from theater.aeoncinema.com. We hit that JSON
 * directly — no HTML scraping.
 *
 *   schedule:  /schedule/v2/data/{slug}/schedule.json
 *              -> { "YYYYMMDD": { "<roomId>": [ screening, ... ] } }
 *   movies:    /schedule/v2/data/__master/movies.json   (shared, ~4MB)
 *              -> { "<identifier>": { name:{en,ja}, duration:'PT1H59M',
 *                                     thumbnailUrl, ... } }
 */
import {
  type ChainAdapter,
  type ParsedFilm,
  type ScrapeContext,
  type ValidationResult,
  cleanTitle,
  dashDate,
  detectLanguage,
  FilmBucketMap,
  getJson,
  UA,
} from './types.ts';

const BASE = 'https://theater.aeoncinema.com';

export async function fetchMoviesMaster(): Promise<Record<string, any>> {
  return await getJson(`${BASE}/schedule/v2/data/__master/movies.json`);
}

async function cinemaExists(slug: string): Promise<boolean> {
  const res = await fetch(`${BASE}/schedule/v2/data/${slug}/schedule.json`, {
    headers: { 'User-Agent': UA },
  });
  return res.ok;
}

async function lookupCinemaName(slug: string): Promise<string | null> {
  try {
    const data = await getJson('https://www.aeoncinema.com/json/_theaters.json');
    for (const region of Object.values<any>(data)) {
      for (const pref of Object.values<any>(region)) {
        for (const t of pref as any[]) {
          if (t.facility_id === slug) return `AEON Cinema ${t.name}`;
        }
      }
    }
  } catch {
    // best-effort; fall through
  }
  return null;
}

/** ISO 8601 duration ('PT1H59M') -> minutes, or null. */
function parseIsoDuration(d: string | undefined): number | null {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?/.exec(d ?? '');
  if (!m || (m[1] === undefined && m[2] === undefined)) return null;
  return Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
}

/** UTC ISO -> 'HH:mm' in JST (UTC+9). */
function jstTime(utcIso: string): string {
  const t = new Date(utcIso).getTime() + 9 * 3600 * 1000;
  const d = new Date(t);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

async function fetchFilms(slug: string, _url: string, ctx: ScrapeContext): Promise<ParsedFilm[]> {
  const schedule = await getJson(`${BASE}/schedule/v2/data/${slug}/schedule.json`);
  const movies = ctx.aeonMovies ?? (ctx.aeonMovies = await fetchMoviesMaster());
  const sourceUrl = `https://cinema.aeoncinema.com/wm/${slug}/`;

  const buckets = new FilmBucketMap();
  for (const [dateKey, rooms] of Object.entries<any>(schedule)) {
    if (!/^\d{8}$/.test(dateKey)) continue;
    const date = dashDate(dateKey);
    for (const screenings of Object.values<any>(rooms)) {
      for (const sc of screenings as any[]) {
        const identifier: string = sc?.superEvent?.workPerformed?.identifier ?? '';
        if (!identifier || !sc?.startDate) continue;

        const nameJa: string = sc?.name?.ja ?? '';
        const nameEn: string = sc?.name?.en ?? '';
        const master = movies[identifier];
        let duration = parseIsoDuration(master?.duration);
        if (duration == null && sc?.endDate) {
          const diff = Math.round(
            (new Date(sc.endDate).getTime() - new Date(sc.startDate).getTime()) / 60000,
          );
          if (diff > 0 && diff < 600) duration = diff;
        }

        buckets.add({
          sourceId: identifier,
          title: cleanTitle(master?.name?.ja || nameJa) || identifier,
          titleOriginal: cleanTitle(master?.name?.en || nameEn) || null,
          posterUrl: master?.thumbnailUrl || null,
          durationMin: duration,
          date,
          language: detectLanguage(nameJa, nameEn),
          times: [jstTime(sc.startDate)],
        });
      }
    }
  }
  return buckets.toFilms(sourceUrl);
}

async function validate(slug: string): Promise<ValidationResult> {
  if (!(await cinemaExists(slug))) {
    throw new Error('No AEON schedule found for that URL.');
  }
  const schedule = await getJson(`${BASE}/schedule/v2/data/${slug}/schedule.json`);
  const ids = new Set<string>();
  for (const [dateKey, rooms] of Object.entries<any>(schedule)) {
    if (!/^\d{8}$/.test(dateKey)) continue;
    for (const screenings of Object.values<any>(rooms)) {
      for (const sc of screenings as any[]) {
        const id = sc?.superEvent?.workPerformed?.identifier;
        if (id) ids.add(id);
      }
    }
  }
  const name = (await lookupCinemaName(slug)) ?? `AEON Cinema ${slug}`;
  return { name, films: ids.size };
}

export const aeonAdapter: ChainAdapter = {
  chain: 'aeon',
  parseUrl(url: string): string | null {
    const m =
      url.match(/cinema\.aeoncinema\.com\/wm\/([a-z0-9_-]+)/i) ??
      url.match(/theater\.aeoncinema\.com\/theaters\/([a-z0-9_-]+)/i) ??
      url.match(/aeoncinema\.com\/cinema2?\/([a-z0-9_-]+)/i);
    return m ? m[1].toLowerCase() : null;
  },
  canonicalUrl(slug: string): string {
    return `https://cinema.aeoncinema.com/wm/${slug}/`;
  },
  validate,
  fetchFilms,
};
