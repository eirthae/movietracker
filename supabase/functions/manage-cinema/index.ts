/**
 * manage-cinema — validate, add, or delete a cinema from the app.
 *
 *   POST { action: 'validate', url }      -> parse slug, check the schedule
 *                                            endpoint exists, look up the name,
 *                                            count films (Add Cinema preview)
 *   POST { action: 'add', url, name? }    -> validate, insert, scrape immediately
 *   POST { action: 'delete', id }         -> delete cinema (films cascade)
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import {
  cinemaExists,
  countFilms,
  fetchCinema,
  lookupCinemaName,
  parseSlug,
} from '../_shared/aeon.ts';
import { persistCinema } from '../_shared/persist.ts';

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
    const slug = parseSlug(String(payload.url ?? ''));
    if (!slug) {
      return json({ error: 'Could not read a cinema slug from that URL.' }, 400);
    }
    if (!(await cinemaExists(slug))) {
      return json({ error: 'No AEON schedule found for that URL.' }, 404);
    }
    const { data: dupe } = await supabase
      .from('cinemas')
      .select('id')
      .eq('id', slug)
      .maybeSingle();
    if (dupe) return json({ error: 'That cinema is already added.' }, 409);

    const [name, films] = await Promise.all([
      lookupCinemaName(slug),
      countFilms(slug).catch(() => 0),
    ]);
    return json({ ok: true, slug, name: name ?? `AEON Cinema ${slug}`, films });
  }

  // ---- ADD ----
  if (payload?.action === 'add') {
    const slug = parseSlug(String(payload.url ?? ''));
    if (!slug) {
      return json({ error: 'Could not read a cinema slug from that URL.' }, 400);
    }
    if (!(await cinemaExists(slug))) {
      return json({ error: 'No AEON schedule found for that URL.' }, 404);
    }
    const { data: dupe } = await supabase
      .from('cinemas')
      .select('id')
      .eq('id', slug)
      .maybeSingle();
    if (dupe) return json({ error: 'That cinema is already added.' }, 409);

    const name =
      (typeof payload.name === 'string' && payload.name.trim()) ||
      (await lookupCinemaName(slug)) ||
      `AEON Cinema ${slug}`;

    const { data: maxRow } = await supabase
      .from('cinemas')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const cinema = {
      id: slug,
      name,
      schedule_url: `https://cinema.aeoncinema.com/wm/${slug}/`,
      display_order: (maxRow?.display_order ?? -1) + 1,
    };
    const { error: insErr } = await supabase.from('cinemas').insert(cinema);
    if (insErr) return json({ error: insErr.message }, 500);

    // Scrape immediately so the new tab has data right away.
    const { data: logRow } = await supabase
      .from('scrape_log')
      .insert({ cinema_id: slug, started_at: new Date().toISOString() })
      .select('id')
      .single();
    try {
      const films = await fetchCinema(slug);
      const { filmCount } = await persistCinema(supabase, slug, films);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'success' })
        .eq('id', logRow?.id);
      return json({ ok: true, cinema, films: filmCount });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'error', error_msg: msg })
        .eq('id', logRow?.id);
      // The cinema row stays; the weekly cron will retry the scrape.
      return json({ ok: true, cinema, films: 0, scrapeError: msg });
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
