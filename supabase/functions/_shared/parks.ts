/**
 * Parks Cinema / SMT (Shochiku Multiplex Theatres) adapter.
 *
 * Sites like www.parkscinema.com/site/namba/ (same platform as
 * *.smt-cinema.com) load a server-rendered weekly schedule fragment:
 *
 *   {origin}/site/{slug}/week.html            (Shift_JIS)
 *     -> contains  thnumber="1070"  and  <title>週間上映スケジュール | {name}</title>
 *   {origin}/schedule/pc/s0200_{thnumber}.html  (UTF-8)
 *     -> one <tr> per film version:
 *          <h2><a href="…detail.html?cinemaid=T0032291…">TITLE（字幕版）</a></h2>
 *          （本編：163分）  + poster img (movie_data/…_leafletimg_s.jpg)
 *          then one <td> per day with screendate=YYYYMMDD in onclick and
 *          <p>15:00</p> showtimes (未定 = TBD, no link).
 *
 * Covers the current week only — the weekly cron keeps it rolling.
 */
import {
  type ChainAdapter,
  type ParsedFilm,
  type ValidationResult,
  cleanTitle,
  detectLanguage,
  FilmBucketMap,
  getText,
  normalize,
  padTime,
} from './types.ts';

function originOf(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.origin;
  } catch {
    return 'https://www.parkscinema.com';
  }
}

async function fetchWeekMeta(
  origin: string,
  slug: string,
): Promise<{ thnumber: string; name: string | null }> {
  const html = await getText(`${origin}/site/${slug}/week.html`);
  const th = /thnumber\s*=\s*"(\d+)"/.exec(html);
  if (!th) throw new Error('No schedule found for that URL (theatre number missing).');
  const title = /<title>[^<|]*\|\s*([^<]+)<\/title>/.exec(html);
  return { thnumber: th[1], name: title ? normalize(title[1]) : null };
}

interface Row {
  sourceId: string;
  title: string;
  durationMin: number | null;
  posterUrl: string | null;
  days: { date: string; times: string[] }[];
}

function parseRows(frag: string, origin: string): Row[] {
  const rows: Row[] = [];
  for (const tr of frag.split(/<tr[\s>]/).slice(1)) {
    const title = /<h2><a[^>]*>([^<]+)<\/a><\/h2>/.exec(tr);
    const cid = /cinemaid=(T?\w+)/.exec(tr);
    if (!title || !cid) continue;

    const dur = /本編[：:]\s*(\d+)\s*分/.exec(tr);
    const img = /<img\s+src="([^"]*movie_data[^"]*)"/.exec(tr);
    const poster = img ? (img[1].startsWith('http') ? img[1] : origin + img[1]) : null;

    const days: Row['days'] = [];
    for (const td of tr.split(/<td[\s>]/).slice(1)) {
      const date = /screendate=(\d{8})/.exec(td);
      if (!date) continue;
      const times = [...td.matchAll(/<p>\s*(\d{1,2}:\d{2})\s*<\/p>/g)].map((m) => padTime(m[1]));
      if (times.length) {
        days.push({
          date: `${date[1].slice(0, 4)}-${date[1].slice(4, 6)}-${date[1].slice(6, 8)}`,
          times,
        });
      }
    }
    rows.push({
      sourceId: cid[1],
      title: title[1].trim(),
      durationMin: dur ? Number(dur[1]) : null,
      posterUrl: poster,
      days,
    });
  }
  return rows;
}

async function fetchFilms(slug: string, url: string): Promise<ParsedFilm[]> {
  const origin = originOf(url);
  const { thnumber } = await fetchWeekMeta(origin, slug);
  const frag = await getText(`${origin}/schedule/pc/s0200_${thnumber}.html`);
  const sourceUrl = `${origin}/site/${slug}/week.html`;

  const buckets = new FilmBucketMap();
  for (const row of parseRows(frag, origin)) {
    for (const day of row.days) {
      buckets.add({
        sourceId: row.sourceId,
        title: cleanTitle(normalize(row.title)) || row.sourceId,
        titleOriginal: null,
        posterUrl: row.posterUrl,
        durationMin: row.durationMin,
        date: day.date,
        language: detectLanguage(row.title),
        times: day.times,
      });
    }
  }
  return buckets.toFilms(sourceUrl);
}

async function validate(slug: string, url: string): Promise<ValidationResult> {
  const origin = originOf(url);
  const { thnumber, name } = await fetchWeekMeta(origin, slug);
  const frag = await getText(`${origin}/schedule/pc/s0200_${thnumber}.html`);
  const rows = parseRows(frag, origin);
  if (!rows.length) throw new Error('That schedule page has no films this week.');
  return { name: name ?? `Parks Cinema ${slug}`, films: rows.length };
}

export const parksAdapter: ChainAdapter = {
  chain: 'parks',
  parseUrl(url: string): string | null {
    const m = url.match(/(?:parkscinema\.com|smt-cinema\.com)\/(?:sp\/)?site\/([a-z0-9_-]+)/i);
    return m ? m[1].toLowerCase() : null;
  },
  canonicalUrl(slug: string, originalUrl: string): string {
    return `${originOf(originalUrl)}/site/${slug}/week.html`;
  },
  validate,
  fetchFilms,
};
