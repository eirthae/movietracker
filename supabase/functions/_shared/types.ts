/** Shared adapter types + helpers for all cinema chains. */

export type Language = 'english' | 'japanese' | 'unknown';
export type FilmStatus = 'now_showing' | 'upcoming';

export interface ParsedScreening {
  date: string; // 'YYYY-MM-DD' (JST)
  language: Language;
  times: string[]; // ['10:00', '13:30'] (JST)
}

export interface ParsedFilm {
  source_id: string; // chain's movie identifier
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

/** Shared per-run cache (e.g. AEON's ~4MB movies master, fetched once). */
export interface ScrapeContext {
  aeonMovies?: Record<string, any>;
}

export interface ValidationResult {
  name: string;
  films: number;
}

export interface ChainAdapter {
  chain: string;
  /** Extract this chain's cinema slug from a pasted URL, or null. */
  parseUrl(url: string): string | null;
  /** Canonical schedule URL to store/deep-link (originalUrl keeps the host for multi-host chains). */
  canonicalUrl(slug: string, originalUrl: string): string;
  /** Check the cinema exists; return display name + film count for the Add preview. Throws on failure. */
  validate(slug: string, url: string): Promise<ValidationResult>;
  /** Fetch + parse the full schedule. */
  fetchFilms(slug: string, url: string, ctx: ScrapeContext): Promise<ParsedFilm[]>;
}

export const UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

export async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  return await res.json();
}

/** Fetch text with encoding sniffing: strict UTF-8 first, Shift_JIS fallback
 * (Japanese cinema sites mix both, sometimes across pages of one site). */
export async function getText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch {
    return new TextDecoder('shift_jis').decode(buf);
  }
}

/**
 * Language from title markers, common to all Japanese chains:
 *   字幕 / SUB = subtitled -> original audio (English for Western films)
 *   吹替 / DUB = dubbed    -> Japanese
 *   no marker             -> Japanese domestic release
 */
export function detectLanguage(nameJa: string, nameEn = ''): Language {
  const ja = nameJa ?? '';
  const en = (nameEn ?? '').trim();
  if (ja.includes('字幕') || /^SUB\b/i.test(en)) return 'english';
  if (ja.includes('吹替') || /^DUB\b/i.test(en)) return 'japanese';
  return 'japanese';
}

/** Strip 字幕/吹替 markers: AEON-style prefixes, （字幕版）-style parts, and
 * TOHO's '/ SUB MX4D 3D'-style English-title tails. */
export function cleanTitle(s: string): string {
  return (s ?? '')
    .replace(/^(字幕|吹替)[\s　]*/u, '')
    .replace(/^(SUB|DUB)\b[\s]*/i, '')
    .replace(/[（(]\s*(字幕|吹替)\s*版?\s*[）)]/gu, '')
    .replace(/\s*\/\s*(SUB|DUB)\b.*$/i, '')
    .trim();
}

/** Fullwidth -> halfwidth etc. (ＴＯＨＯ -> TOHO, full-width digits/spaces). */
export function normalize(s: string): string {
  return (s ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim();
}

export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/** today+n in JST as 'YYYYMMDD'. */
export function jstDayPlus(n: number): string {
  return new Date(Date.now() + 9 * 3600 * 1000 + n * 86400 * 1000)
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '');
}

/** 'YYYYMMDD' -> 'YYYY-MM-DD'. */
export function dashDate(key: string): string {
  return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

/** '8:15' -> '08:15'. */
export function padTime(t: string): string {
  const [h, m] = t.split(':');
  return `${h.padStart(2, '0')}:${m}`;
}

/** Aggregation bucket shared by adapters: film keyed by source id, slots by date|language. */
export class FilmBucketMap {
  private map = new Map<
    string,
    {
      title: string;
      title_original: string | null;
      poster_url: string | null;
      duration_min: number | null;
      minDate: string;
      maxDate: string;
      slots: Map<string, { date: string; language: Language; times: Set<string> }>;
    }
  >();

  add(opts: {
    sourceId: string;
    title: string;
    titleOriginal: string | null;
    posterUrl: string | null;
    durationMin: number | null;
    date: string; // 'YYYY-MM-DD'
    language: Language;
    times: string[];
  }): void {
    if (!opts.times.length) return;
    let b = this.map.get(opts.sourceId);
    if (!b) {
      b = {
        title: opts.title,
        title_original:
          opts.titleOriginal && opts.titleOriginal !== opts.title ? opts.titleOriginal : null,
        poster_url: opts.posterUrl,
        duration_min: opts.durationMin,
        minDate: opts.date,
        maxDate: opts.date,
        slots: new Map(),
      };
      this.map.set(opts.sourceId, b);
    }
    if (b.duration_min == null && opts.durationMin != null) b.duration_min = opts.durationMin;
    if (b.poster_url == null && opts.posterUrl != null) b.poster_url = opts.posterUrl;
    if (opts.date < b.minDate) b.minDate = opts.date;
    if (opts.date > b.maxDate) b.maxDate = opts.date;

    const key = `${opts.date}|${opts.language}`;
    let slot = b.slots.get(key);
    if (!slot) {
      slot = { date: opts.date, language: opts.language, times: new Set() };
      b.slots.set(key, slot);
    }
    for (const t of opts.times) slot.times.add(t);
  }

  toFilms(sourceUrl: string): ParsedFilm[] {
    const today = todayJst();
    const result: ParsedFilm[] = [];
    for (const [sourceId, b] of this.map) {
      const screenings: ParsedScreening[] = [...b.slots.values()].map((s) => ({
        date: s.date,
        language: s.language,
        times: [...s.times].sort(),
      }));
      screenings.sort(
        (a, z) => a.date.localeCompare(z.date) || a.language.localeCompare(z.language),
      );
      if (!screenings.length) continue;
      result.push({
        source_id: sourceId,
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
}
