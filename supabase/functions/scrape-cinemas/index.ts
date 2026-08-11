/**
 * scrape-cinemas — daily cron + manual invoke.
 *
 * Fetches every cinema's schedule via its chain adapter (AEON / TOHO / Parks),
 * upserts films and screenings, and logs each run. Each cinema is isolated in
 * its own try/catch so one failure never aborts the others.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { adapterFor } from '../_shared/registry.ts';
import { persistCinema } from '../_shared/persist.ts';
import type { ScrapeContext } from '../_shared/types.ts';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: cinemas, error } = await supabase
    .from('cinemas')
    .select('id, chain, slug, schedule_url')
    .order('display_order');
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Shared per-run cache (AEON's ~4MB movies master is fetched once, lazily).
  const ctx: ScrapeContext = {};
  const results: Record<string, unknown> = {};

  for (const cinema of cinemas ?? []) {
    const { data: logRow } = await supabase
      .from('scrape_log')
      .insert({ cinema_id: cinema.id, started_at: new Date().toISOString() })
      .select('id')
      .single();

    try {
      const adapter = adapterFor(cinema.chain);
      if (!adapter) throw new Error(`No adapter for chain '${cinema.chain}'`);
      const films = await adapter.fetchFilms(cinema.slug, cinema.schedule_url, ctx);
      // persistCinema deletes anything not in this run, so an empty parse would
      // silently wipe a working cinema (e.g. the source mid-rebuild, or a shape
      // change upstream). Fail the run instead and keep yesterday's data.
      if (!films.length) throw new Error('adapter returned 0 films — keeping existing data');
      const { filmCount, screeningCount } = await persistCinema(supabase, cinema.id, films);

      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'success' })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: true, films: filmCount, screenings: screeningCount };
    } catch (e) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'error', error_msg: msg })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: false, error: msg };
    }
  }

  // Drop anything that has aged out of the app's today-onward horizon. Runs
  // unconditionally: a cinema whose fetch keeps failing keeps its last-known
  // rows, and those are dead weight the moment their dates pass — nothing else
  // would ever remove them (AEON's Aug 1-11 outage left 333 such screenings).
  let purged: unknown = null;
  try {
    const { data, error: purgeErr } = await supabase.rpc('purge_expired_data');
    if (purgeErr) throw purgeErr;
    purged = data;
  } catch (e) {
    // Never fail a good scrape over housekeeping; next run retries.
    purged = { error: e instanceof Error ? e.message : JSON.stringify(e) };
  }

  return Response.json({ ok: true, results, purged });
});
