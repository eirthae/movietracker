/**
 * TOHO Cinemas adapter.
 *
 * The schedule pages (hlo.tohotheater.jp/net/schedule/{site}/TNPI2000J01.do)
 * are rendered client-side from a JSON API:
 *
 *   https://api2.tohotheater.jp/api/schedule/v1/schedule/{site}/TNPI3050J02
 *     ?__type__=json&__useResultInfo__=no&vg_cd={site}&show_day=YYYYMMDD
 *     &term=99&isMember=&enter_kbn=&_dc={unix}
 *
 *   -> { status: '0', data: [ { showDay, list: [ site ->
 *        { name, code, list: [ movie -> { code, name, ename, hours,
 *          list: [ screen -> { list: [ { showingStart: '8:15', … } ] } ] } ] } ] } ] }
 *
 * One request per day; we sweep today..+13. Names are full-width
 * (ＴＯＨＯ) — normalized with NFKC. Language markers live in the JA title
 * (（字幕版）/（吹替版）); each version is its own movie code.
 */
import {
  type ChainAdapter,
  type ParsedFilm,
  type ValidationResult,
  cleanTitle,
  dashDate,
  detectLanguage,
  FilmBucketMap,
  getJson,
  jstDayPlus,
  normalize,
  padTime,
} from './types.ts';

const API = 'https://api2.tohotheater.jp/api/schedule/v1/schedule';
const DAYS_AHEAD = 14;

function dayUrl(slug: string, day: string): string {
  return (
    `${API}/${slug}/TNPI3050J02?__type__=json&__useResultInfo__=no` +
    `&vg_cd=${slug}&show_day=${day}&term=99&isMember=&enter_kbn=&_dc=${Date.now()}`
  );
}

async function fetchDay(slug: string, day: string): Promise<any[]> {
  try {
    const json = await getJson(dayUrl(slug, day));
    if (json?.status !== '0' || !Array.isArray(json.data)) return [];
    return json.data;
  } catch {
    return []; // days with no schedule yet
  }
}

async function fetchFilms(slug: string, _url: string): Promise<ParsedFilm[]> {
  const sourceUrl = `https://hlo.tohotheater.jp/net/schedule/${slug}/TNPI2000J01.do`;
  const buckets = new FilmBucketMap();

  for (let n = 0; n < DAYS_AHEAD; n++) {
    const day = jstDayPlus(n);
    const data = await fetchDay(slug, day);
    const date = dashDate(day);
    for (const entry of data) {
      for (const site of entry.list ?? []) {
        for (const movie of site.list ?? []) {
          const rawName: string = movie?.name ?? '';
          const code = String(movie?.code || movie?.mcode || '');
          if (!code || !rawName) continue;

          const times: string[] = [];
          for (const screen of movie.list ?? []) {
            for (const showing of screen.list ?? []) {
              const start = showing?.showingStart;
              if (typeof start === 'string' && /^\d{1,2}:\d{2}$/.test(start)) {
                times.push(padTime(start));
              }
            }
          }
          if (!times.length) continue;

          const ename = normalize(movie?.ename ?? '');
          buckets.add({
            sourceId: code,
            title: cleanTitle(normalize(rawName)) || code,
            titleOriginal: cleanTitle(ename) || null,
            posterUrl: movie?.thumbnail ? String(movie.thumbnail) : null,
            durationMin: typeof movie?.hours === 'number' && movie.hours > 0 ? movie.hours : null,
            date,
            language: detectLanguage(rawName, ename),
            times,
          });
        }
      }
    }
  }
  return buckets.toFilms(sourceUrl);
}

async function validate(slug: string): Promise<ValidationResult> {
  // Try today, then tomorrow (late-night gap between schedule days).
  let data = await fetchDay(slug, jstDayPlus(0));
  if (!data.length) data = await fetchDay(slug, jstDayPlus(1));
  const sites = data[0]?.list ?? [];
  if (!sites.length) throw new Error('No TOHO schedule found for that URL.');

  const name = normalize(sites[0].name ?? '') || `TOHO Cinemas ${slug}`;
  const codes = new Set<string>();
  for (const site of sites) {
    for (const movie of site.list ?? []) {
      if (movie?.code) codes.add(String(movie.code));
    }
  }
  return { name, films: codes.size };
}

export const tohoAdapter: ChainAdapter = {
  chain: 'toho',
  parseUrl(url: string): string | null {
    const m =
      url.match(/hlo\.tohotheater\.jp\/net\/(?:schedule|ticket)\/(\d{3})\//i) ??
      url.match(/tohotheater\.jp\/theater\/(\d{3})\b/i);
    return m ? m[1] : null;
  },
  canonicalUrl(slug: string): string {
    return `https://hlo.tohotheater.jp/net/schedule/${slug}/TNPI2000J01.do`;
  },
  validate,
  fetchFilms,
};
