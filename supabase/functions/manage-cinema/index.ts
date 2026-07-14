/**
 * manage-cinema — validate, add, or delete a cinema.
 *
 *   POST { action: 'validate', url }   -> resolve chain adapter from the URL,
 *                                         check the schedule exists, return
 *                                         { id, chain, slug, name, films, existing }
 *   POST { action: 'add', url, name? } -> insert + immediate scrape; if the
 *                                         cinema already exists in the shared DB
 *                                         just return it (devices keep their own
 *                                         cinema lists client-side)
 *   POST { action: 'delete', id }      -> delete cinema (films cascade)
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { resolveUrl } from '../_shared/registry.ts';
import { persistCinema } from '../_shared/persist.ts';
import type { ScrapeContext } from '../_shared/types.ts';

const UNSUPPORTED = 'Unsupported URL — paste an AEON, TOHO, or Parks Cinema schedule page.';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // ---- VALIDATE (Add Cinema preview card) ----
  if (payload?.action === 'validate') {
    const resolved = resolveUrl(String(payload.url ?? ''));
    if (!resolved) return json({ error: UNSUPPORTED }, 400);

    const { data: existing } = await supabase
      .from('cinemas')
      .select('id, name')
      .eq('id', resolved.id)
      .maybeSingle();
    if (existing) {
      // Already scraped for someone — the device just attaches to it.
      const { count } = await supabase
        .from('films')
        .select('id', { count: 'exact', head: true })
        .eq('cinema_id', resolved.id);
      return json({
        ok: true,
        id: resolved.id,
        chain: resolved.chain,
        slug: resolved.slug,
        name: existing.name,
        films: count ?? 0,
        existing: true,
      });
    }
    try {
      const v = await resolved.adapter.validate(resolved.slug, String(payload.url));
      return json({
        ok: true,
        id: resolved.id,
        chain: resolved.chain,
        slug: resolved.slug,
        name: v.name,
        films: v.films,
        existing: false,
      });
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : JSON.stringify(e) }, 404);
    }
  }

  // ---- ADD ----
  if (payload?.action === 'add') {
    const resolved = resolveUrl(String(payload.url ?? ''));
    if (!resolved) return json({ error: UNSUPPORTED }, 400);

    const { data: dupe } = await supabase
      .from('cinemas')
      .select('*')
      .eq('id', resolved.id)
      .maybeSingle();
    if (dupe) return json({ ok: true, cinema: dupe, existing: true });

    const name =
      (typeof payload.name === 'string' && payload.name.trim()) ||
      (await resolved.adapter.validate(resolved.slug, String(payload.url)).then(
        (v) => v.name,
        () => null,
      )) ||
      `${resolved.chain} ${resolved.slug}`;

    const { data: maxRow } = await supabase
      .from('cinemas')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const cinema = {
      id: resolved.id,
      chain: resolved.chain,
      slug: resolved.slug,
      name,
      schedule_url: resolved.scheduleUrl,
      display_order: (maxRow?.display_order ?? -1) + 1,
    };
    const { error: insErr } = await supabase.from('cinemas').insert(cinema);
    if (insErr) return json({ error: insErr.message }, 500);

    // Scrape immediately so the new tab has data right away.
    const { data: logRow } = await supabase
      .from('scrape_log')
      .insert({ cinema_id: resolved.id, started_at: new Date().toISOString() })
      .select('id')
      .single();
    try {
      const ctx: ScrapeContext = {};
      const films = await resolved.adapter.fetchFilms(resolved.slug, resolved.scheduleUrl, ctx);
      const { filmCount } = await persistCinema(supabase, resolved.id, films);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'success' })
        .eq('id', logRow?.id);
      return json({ ok: true, cinema, films: filmCount, existing: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'error', error_msg: msg })
        .eq('id', logRow?.id);
      // The cinema row stays; the weekly cron will retry the scrape.
      return json({ ok: true, cinema, films: 0, existing: false, scrapeError: msg });
    }
  }

  // ---- DELETE ----
  if (payload?.action === 'delete') {
    if (!payload.id) return json({ error: 'Missing cinema id.' }, 400);
    const { error } = await supabase.from('cinemas').delete().eq('id', payload.id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Unknown action.' }, 400);
});
