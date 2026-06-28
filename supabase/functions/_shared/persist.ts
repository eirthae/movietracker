/**
 * Persist a cinema's parsed films into Postgres (service-role client).
 *
 * Strategy:
 *  - upsert films by (cinema_id, title, status); first_seen_at is left out of the
 *    payload so it keeps its INSERT default on existing rows (drives notifications)
 *  - delete films for this cinema that were NOT seen this run (and cascade screenings)
 *  - replace each surviving film's screenings wholesale (schedule changes weekly)
 *  - report films that are newly inserted AND have an English screening
 */
import type { ParsedFilm } from './aeon.ts';

export interface NewEnglishFilm {
  id: string;
  title: string;
  status: 'now_showing' | 'upcoming';
}

export interface PersistResult {
  filmCount: number;
  newEnglishFilms: NewEnglishFilm[];
}

const keyOf = (title: string, status: string, language: string) => `${title}|${status}|${language}`;

export async function persistCinema(
  supabase: any,
  cinemaId: string,
  films: ParsedFilm[],
): Promise<PersistResult> {
  // 1. Existing films for this cinema (to know what's new).
  const { data: existing, error: exErr } = await supabase
    .from('films')
    .select('id, title, status, language')
    .eq('cinema_id', cinemaId);
  if (exErr) throw exErr;
  const existingKeys = new Set(
    (existing ?? []).map((f: any) => keyOf(f.title, f.status, f.language)),
  );

  // 2. Upsert films, returning ids.
  const payload = films.map((f) => ({
    cinema_id: cinemaId,
    title: f.title,
    title_original: f.title_original,
    poster_url: f.poster_url,
    status: f.status,
    language: f.language,
    run_from: f.run_from,
    run_to: f.run_to,
    source_url: f.source_url,
    last_scraped_at: new Date().toISOString(),
  }));

  let upserted: any[] = [];
  if (payload.length) {
    const { data, error } = await supabase
      .from('films')
      .upsert(payload, { onConflict: 'cinema_id,title,status,language' })
      .select('id, title, status, language');
    if (error) throw error;
    upserted = data ?? [];
  }

  const idByKey = new Map<string, string>();
  for (const row of upserted) idByKey.set(keyOf(row.title, row.status, row.language), row.id);
  const currentIds = upserted.map((r) => r.id);

  // 3. Delete films no longer scheduled (cascades to screenings).
  if (currentIds.length) {
    await supabase
      .from('films')
      .delete()
      .eq('cinema_id', cinemaId)
      .not('id', 'in', `(${currentIds.join(',')})`);
  } else {
    await supabase.from('films').delete().eq('cinema_id', cinemaId);
  }

  // 4. Replace screenings for the surviving films.
  if (currentIds.length) {
    await supabase.from('screenings').delete().in('film_id', currentIds);
  }
  const screeningRows: any[] = [];
  for (const f of films) {
    const filmId = idByKey.get(keyOf(f.title, f.status));
    if (!filmId) continue;
    for (const s of f.screenings) {
      screeningRows.push({
        film_id: filmId,
        date: s.date,
        times: s.times,
        language: s.language,
        screen: s.screen,
      });
    }
  }
  // Insert in chunks to stay well under payload limits.
  for (let i = 0; i < screeningRows.length; i += 500) {
    const chunk = screeningRows.slice(i, i + 500);
    const { error } = await supabase.from('screenings').insert(chunk);
    if (error) throw error;
  }

  // 5. Newly-inserted English-language films (each language is its own row now).
  const newEnglishFilms: NewEnglishFilm[] = [];
  for (const f of films) {
    const k = keyOf(f.title, f.status, f.language);
    if (existingKeys.has(k)) continue; // not new
    if (f.language !== 'english') continue;
    const id = idByKey.get(k);
    // Notify using the English title when we have it.
    if (id) newEnglishFilms.push({ id, title: f.title_original || f.title, status: f.status });
  }

  return { filmCount: films.length, newEnglishFilms };
}
