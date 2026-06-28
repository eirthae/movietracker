/**
 * AEON Cinema data adapter.
 *
 * The public schedule pages (cinema.aeoncinema.com/wm/{slug}/) render a JS
 * widget that loads clean JSON from theater.aeoncinema.com. We hit that JSON
 * directly — no HTML scraping, no headless browser needed.
 *
 *   schedule:  /schedule/v2/data/{slug}/schedule.json
 *              -> { "YYYYMMDD": { "<roomId>": [ screening, ... ] } }
 *   movies:    /schedule/v2/data/__master/movies.json   (shared, ~4MB)
 *              -> { "<identifier>": { name:{en,ja}, duration, thumbnailUrl, ... } }
 *
 * Language signal (brief §11): a screening's title is prefixed
 *   字幕 / "SUB" = subtitled  -> original audio (English for Western films)
 *   吹替 / "DUB" = dubbed     -> Japanese
 */

const BASE = 'https://theater.aeoncinema.com';
const UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

export type Language = 'english' | 'japanese' | 'unknown';
export type FilmStatus = 'now_showing' | 'upcoming';

export interface ParsedScreening {
  date: string; // 'YYYY-MM-DD' (JST)
  times: string[]; // ['10:00', '13:30']
  language: Language;
  screen: string | null;
}

export interface ParsedFilm {
  title: string;
  title_original: string | null;
  poster_url: string | null;
  status: FilmStatus;
  language: Language; // each language variant is its own film
  run_from: string | null;
  run_to: string | null;
  source_url: string;
  screenings: ParsedScreening[];
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  return await res.json();
}

/** True if the schedule endpoint for this slug exists (used to validate adds). */
export async function cinemaExists(slug: string): Promise<boolean> {
  const res = await fetch(`${BASE}/schedule/v2/data/${slug}/schedule.json`, {
    method: 'GET',
    headers: { 'User-Agent': UA },
  });
  return res.ok;
}

/** Look up a theatre's display name from AEON's facility index, by slug. */
export async function lookupCinemaName(slug: string): Promise<string | null> {
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

/** Pull the AEON theatre slug out of a schedule URL (null if not an AEON URL). */
export function parseSlug(url: string): string | null {
  const m =
    url.match(/cinema\.aeoncinema\.com\/wm\/([a-z0-9_-]+)/i) ??
    url.match(/theater\.aeoncinema\.com\/theaters\/([a-z0-9_-]+)/i) ??
    url.match(/aeoncinema\.com\/cinema2?\/([a-z0-9_-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

export function detectLanguage(nameJa: string, nameEn: string): Language {
  const ja = nameJa ?? '';
  const en = (nameEn ?? '').trim();
  if (ja.startsWith('字幕') || /^SUB\b/i.test(en)) return 'english';
  if (ja.startsWith('吹替') || /^DUB\b/i.test(en)) return 'japanese';
  // Unlabelled AEON screenings are Japanese-language domestic releases.
  return 'japanese';
}

/** Strip 字幕/吹替/SUB/DUB prefixes and leading (ideographic) spaces. */
export function cleanTitle(s: string): string {
  return (s ?? '')
    .replace(/^(字幕|吹替)[\s　]*/u, '')
    .replace(/^(SUB|DUB)\b[\s]*/i, '')
    .trim();
}

/** 'YYYYMMDD' -> 'YYYY-MM-DD'. */
function dashDate(key: string): string {
  return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

/** UTC ISO -> 'HH:mm' in JST (UTC+9). */
function jstTime(utcIso: string): string {
  const t = new Date(utcIso).getTime() + 9 * 3600 * 1000;
  const d = new Date(t);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function todayJst(): string {
  const t = Date.now() + 9 * 3600 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Fetch + parse one cinema into ParsedFilm[]. `moviesMaster` can be passed in
 * to avoid re-downloading the shared ~4MB movies file for every cinema.
 */
export async function fetchCinema(
  slug: string,
  moviesMaster?: Record<string, any>,
): Promise<ParsedFilm[]> {
  const schedule = await getJson(`${BASE}/schedule/v2/data/${slug}/schedule.json`);
  const movies =
    moviesMaster ?? (await getJson(`${BASE}/schedule/v2/data/__master/movies.json`));
  const sourceUrl = `https://cinema.aeoncinema.com/wm/${slug}/`;
  const today = todayJst();

  // Aggregate by (movie identifier + language) so each language is its own film,
  // then by date+screen within that.
  type Bucket = {
    title: string;
    title_original: string | null;
    poster_url: string | null;
    language: Language;
    minDate: string;
    maxDate: string;
    // key = `${date}|${screen}` -> Set of times
    slots: Map<string, { date: string; screen: string | null; times: Set<string> }>;
  };
  const films = new Map<string, Bucket>();

  for (const [dateKey, rooms] of Object.entries<any>(schedule)) {
    if (!/^\d{8}$/.test(dateKey)) continue;
    const date = dashDate(dateKey);
    for (const screenings of Object.values<any>(rooms)) {
      for (const sc of screenings as any[]) {
        const wp = sc?.superEvent?.workPerformed;
        const identifier: string = wp?.identifier ?? sc?.id ?? '';
        if (!identifier) continue;

        const nameJa: string = sc?.name?.ja ?? '';
        const nameEn: string = sc?.name?.en ?? '';
        const language = detectLanguage(nameJa, nameEn);
        const screen: string | null = sc?.location?.name?.ja ?? null;
        const time = sc?.startDate ? jstTime(sc.startDate) : null;
        if (!time) continue;

        const master = movies[identifier];
        const title = cleanTitle(master?.name?.ja || nameJa) || identifier;
        const original = cleanTitle(master?.name?.en || nameEn) || null;
        const poster = master?.thumbnailUrl ?? null;

        const filmKey = `${identifier}|${language}`;
        let bucket = films.get(filmKey);
        if (!bucket) {
          bucket = {
            title,
            title_original: original && original !== title ? original : null,
            poster_url: poster,
            language,
            minDate: date,
            maxDate: date,
            slots: new Map(),
          };
          films.set(filmKey, bucket);
        }
        if (date < bucket.minDate) bucket.minDate = date;
        if (date > bucket.maxDate) bucket.maxDate = date;

        const key = `${date}|${screen ?? ''}`;
        let slot = bucket.slots.get(key);
        if (!slot) {
          slot = { date, screen, times: new Set() };
          bucket.slots.set(key, slot);
        }
        slot.times.add(time);
      }
    }
  }

  // Materialise into ParsedFilm[].
  const result: ParsedFilm[] = [];
  for (const b of films.values()) {
    const screenings: ParsedScreening[] = [...b.slots.values()].map((s) => ({
      date: s.date,
      language: b.language,
      screen: s.screen,
      times: [...s.times].sort(),
    }));
    screenings.sort((a, z) => a.date.localeCompare(z.date));
    result.push({
      title: b.title,
      title_original: b.title_original,
      poster_url: b.poster_url,
      status: b.minDate > today ? 'upcoming' : 'now_showing',
      language: b.language,
      run_from: b.minDate,
      run_to: b.maxDate,
      source_url: sourceUrl,
      screenings,
    });
  }
  return result;
}
