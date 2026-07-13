/**
 * scrape-cinemas — weekly cron + manual invoke.
 *
 * Fetches every cinema's schedule from AEON's JSON API, upserts films and
 * screenings, and logs each run. Each cinema is isolated in its own try/catch
 * so one failure never aborts the others.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { fetchCinema, fetchMoviesMaster } from '../_shared/aeon.ts';
import { persistCinema } from '../_shared/persist.ts';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: cinemas, error } = await supabase
    .from('cinemas')
    .select('id')
    .order('display_order');
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Fetch the shared ~4MB movies master once for all cinemas.
  let moviesMaster: Record<string, any> | undefined;
  try {
    moviesMaster = await fetchMoviesMaster();
  } catch (e) {
    console.error('movies master fetch failed, will fetch per-cinema:', e);
  }

  const results: Record<string, unknown> = {};

  for (const cinema of cinemas ?? []) {
    const { data: logRow } = await supabase
      .from('scrape_log')
      .insert({ cinema_id: cinema.id, started_at: new Date().toISOString() })
      .select('id')
      .single();

    try {
      const films = await fetchCinema(cinema.id, moviesMaster);
      const { filmCount, screeningCount } = await persistCinema(supabase, cinema.id, films);

      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'success' })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: true, films: filmCount, screenings: screeningCount };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'error', error_msg: msg })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: false, error: msg };
    }
  }

  return Response.json({ ok: true, results });
});
