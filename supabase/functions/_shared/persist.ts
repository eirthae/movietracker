/**
 * Persist a cinema's parsed films into Postgres (service-role client).
 *
 * Strategy:
 *  - upsert films by (cinema_id, source_id); first_seen_at is left out of the
 *    payload so it keeps its INSERT default on existing rows
 *  - delete films for this cinema that were NOT seen this run (cascades screenings)
 *  - replace each surviving film's screenings wholesale (schedule changes weekly)
 */
import type { ParsedFilm } from './aeon.ts';

export interface PersistResult {
  filmCount: number;
  screeningCount: number;
}

export async function persistCinema(
  supabase: any,
  cinemaId: string,
  films: ParsedFilm[],
): Promise<PersistResult> {
  // 1. Upsert films, returning ids keyed by source_id.
  const payload = films.map((f) => ({
    cinema_id: cinemaId,
    source_id: f.source_id,
    title: f.title,
    title_original: f.title_original,
    poster_url: f.poster_url,
    duration_min: f.duration_min,
    status: f.status,
    run_from: f.run_from,
    run_to: f.run_to,
    source_url: f.source_url,
    last_scraped_at: new Date().toISOString(),
  }));

  let upserted: any[] = [];
  if (payload.length) {
    const { data, error } = await supabase
      .from('films')
      .upsert(payload, { onConflict: 'cinema_id,source_id' })
      .select('id, source_id');
    if (error) throw error;
    upserted = data ?? [];
  }

  const idBySource = new Map<string, string>();
  for (const row of upserted) idBySource.set(row.source_id, row.id);
  const currentIds = upserted.map((r) => r.id);

  // 2. Delete films no longer on the schedule (cascades to screenings).
  const { data: allFilms, error: allErr } = await supabase
    .from('films')
    .select('id')
    .eq('cinema_id', cinemaId);
  if (allErr) throw allErr;
  const current = new Set(currentIds);
  const staleIds = (allFilms ?? []).map((f: any) => f.id).filter((id: string) => !current.has(id));
  if (staleIds.length) {
    const { error } = await supabase.from('films').delete().in('id', staleIds);
    if (error) throw error;
  }

  // 3. Replace screenings for the surviving films.
  if (currentIds.length) {
    const { error } = await supabase.from('screenings').delete().in('film_id', currentIds);
    if (error) throw error;
  }
  const screeningRows: any[] = [];
  for (const f of films) {
    const filmId = idBySource.get(f.source_id);
    if (!filmId) continue;
    for (const s of f.screenings) {
      screeningRows.push({
        film_id: filmId,
        date: s.date,
        language: s.language,
        times: s.times,
      });
    }
  }
  // Insert in chunks to stay well under payload limits.
  for (let i = 0; i < screeningRows.length; i += 500) {
    const chunk = screeningRows.slice(i, i + 500);
    const { error } = await supabase.from('screenings').insert(chunk);
    if (error) throw error;
  }

  return { filmCount: films.length, screeningCount: screeningRows.length };
}
