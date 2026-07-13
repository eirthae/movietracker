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
 *              -> { "<identifier>": { name:{en,ja}, duration:'PT1H59M',
 *                                     thumbnailUrl, ... } }
 *
 * Language signal: a screening's title prefix
 *   字幕 / "SUB" = subtitled -> original audio (English for Western films)
 *   吹替 / "DUB" = dubbed    -> Japanese
 *   no prefix               -> Japanese domestic release
 *
 * v2 model: one ParsedFilm per AEON movie identifier; language lives on each
 * screening (date + language -> times), so a single film can mix ENG and 日本.
 */

const BASE = 'https://theater.aeoncinema.com';
const UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

export type Language = 'english' | 'japanese' | 'unknown';
export type FilmStatus = 'now_showing' | 'upcoming';

export interface ParsedScreening {
  date: string; // 'YYYY-MM-DD' (JST)
  language: Language;
  times: string[]; // ['10:00', '13:30'] (JST)
}

export interface ParsedFilm {
  source_id: string; // AEON master movie identifier
  title: string; // Japanese display title (cleaned)
  title_original: string | null; // English title when different
  poster_url: string | null;
  duration_min: number | null;
  status: FilmStatus;
  run_from: string;
  run_to: string;
  source_url: string;
  screenings: ParsedScreening[];
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  return await res.json();
}

export async function fetchMoviesMaster(): Promise<Record<string, any>> {
  return await getJson(`${BASE}/schedule/v2/data/__master/movies.json`);
}

/** True if the schedule endpoint for this slug exists (used to validate adds). */
export async function cinemaExists(slug: string): Promise<boolean> {
  const res = await fetch(`${BASE}/schedule/v2/data/${slug}/schedule.json`, {
    method: 'GET',
    headers: { 'User-Agent': UA },
  });
  return res.ok;
}

/** Count distinct films on a cinema's schedule — cheap validation preview. */
export async function countFilms(slug: string): Promise<number> {
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
  return ids.size;
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

/** ISO 8601 duration ('PT1H59M') -> minutes, or null. */
export function parseIsoDuration(d: string | undefined): number | null {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?/.exec(d ?? '');
  if (!m || (m[1] === undefined && m[2] === undefined)) return null;
  return Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
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
  const movies = moviesMaster ?? (await fetchMoviesMaster());
  const sourceUrl = `https://cinema.aeoncinema.com/wm/${slug}/`;
  const today = todayJst();

  // Aggregate by movie identifier; within a film, by date + language.
  type Bucket = {
    title: string;
    title_original: string | null;
    poster_url: string | null;
    duration_min: number | null;
    minDate: string;
    maxDate: string;
    // key = `${date}|${language}` -> Set of 'HH:mm'
    slots: Map<string, { date: string; language: Language; times: Set<string> }>;
  };
  const films = new Map<string, Bucket>();

  for (const [dateKey, rooms] of Object.entries<any>(schedule)) {
    if (!/^\d{8}$/.test(dateKey)) continue;
    const date = dashDate(dateKey);
    for (const screenings of Object.values<any>(rooms)) {
      for (const sc of screenings as any[]) {
        const identifier: string = sc?.superEvent?.workPerformed?.identifier ?? '';
        if (!identifier) continue;

        const nameJa: string = sc?.name?.ja ?? '';
        const nameEn: string = sc?.name?.en ?? '';
        const language = detectLanguage(nameJa, nameEn);
        const time = sc?.startDate ? jstTime(sc.startDate) : null;
        if (!time) continue;

        const master = movies[identifier];
        const title = cleanTitle(master?.name?.ja || nameJa) || identifier;
        const original = cleanTitle(master?.name?.en || nameEn) || null;
        const poster = master?.thumbnailUrl ?? null;
        // Prefer the master's runtime; fall back to this screening's start/end diff.
        let duration = parseIsoDuration(master?.duration);
        if (duration == null && sc?.startDate && sc?.endDate) {
          const diff = Math.round(
            (new Date(sc.endDate).getTime() - new Date(sc.startDate).getTime()) / 60000,
          );
          if (diff > 0 && diff < 600) duration = diff;
        }

        let bucket = films.get(identifier);
        if (!bucket) {
          bucket = {
            title,
            title_original: original && original !== title ? original : null,
            poster_url: poster,
            duration_min: duration,
            minDate: date,
            maxDate: date,
            slots: new Map(),
          };
          films.set(identifier, bucket);
        }
        if (bucket.duration_min == null && duration != null) bucket.duration_min = duration;
        if (date < bucket.minDate) bucket.minDate = date;
        if (date > bucket.maxDate) bucket.maxDate = date;

        const key = `${date}|${language}`;
        let slot = bucket.slots.get(key);
        if (!slot) {
          slot = { date, language, times: new Set() };
          bucket.slots.set(key, slot);
        }
        slot.times.add(time);
      }
    }
  }

  // Materialise into ParsedFilm[].
  const result: ParsedFilm[] = [];
  for (const [identifier, b] of films) {
    const screenings: ParsedScreening[] = [...b.slots.values()].map((s) => ({
      date: s.date,
      language: s.language,
      times: [...s.times].sort(),
    }));
    screenings.sort(
      (a, z) => a.date.localeCompare(z.date) || a.language.localeCompare(z.language),
    );
    result.push({
      source_id: identifier,
      title: b.title,
      title_original: b.title_original,
      poster_url: b.poster_url,
      duration_min: b.duration_min,
      status: b.minDate > today ? 'upcoming' : 'now_showing',
      run_from: b.minDate,
      run_to: b.maxDate,
      source_url: sourceUrl,
      screenings,
    });
  }
  return result;
}
