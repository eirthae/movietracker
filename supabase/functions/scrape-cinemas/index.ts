/**
 * scrape-cinemas — weekly cron + manual invoke.
 *
 * Fetches every cinema's schedule from AEON's JSON API, upserts films/screenings,
 * logs each run, and sends Expo push notifications for newly-added English films
 * at Utazu (brief §15). Each cinema is isolated in its own try/catch so one
 * failure never aborts the others (acceptance #11).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { fetchCinema } from '../_shared/aeon.ts';
import { persistCinema, type NewEnglishFilm } from '../_shared/persist.ts';
import { sendExpoPush, type ExpoPushMessage } from '../_shared/push.ts';

const NOTIFY_CINEMA = 'utazu'; // notifications fire for Utazu only (brief §15)

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: cinemas, error } = await supabase
    .from('cinemas')
    .select('id, url_mobile')
    .order('display_order');
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Fetch the shared ~4MB movies master once for all cinemas.
  let moviesMaster: Record<string, any> | undefined;
  try {
    const res = await fetch(
      'https://theater.aeoncinema.com/schedule/v2/data/__master/movies.json',
    );
    if (res.ok) moviesMaster = await res.json();
  } catch (e) {
    console.error('movies master fetch failed, will fetch per-cinema:', e);
  }

  const results: Record<string, unknown> = {};
  let utazuNewEnglish: NewEnglishFilm[] = [];

  for (const cinema of cinemas ?? []) {
    const { data: logRow } = await supabase
      .from('scrape_log')
      .insert({ cinema_id: cinema.id, started_at: new Date().toISOString() })
      .select('id')
      .single();

    try {
      const films = await fetchCinema(cinema.id, moviesMaster);
      const { filmCount, newEnglishFilms } = await persistCinema(
        supabase,
        cinema.id,
        films,
      );
      if (cinema.id === NOTIFY_CINEMA) utazuNewEnglish = newEnglishFilms;

      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'success' })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: true, films: filmCount, new: newEnglishFilms.length };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase
        .from('scrape_log')
        .update({ finished_at: new Date().toISOString(), status: 'error', error_msg: msg })
        .eq('id', logRow?.id);
      results[cinema.id] = { ok: false, error: msg };
    }
  }

  // Notifications: new English films at Utazu -> all registered devices.
  if (utazuNewEnglish.length) {
    const { data: tokens } = await supabase.from('device_tokens').select('token');
    const targets = (tokens ?? []).map((t: any) => t.token);
    if (targets.length) {
      const messages: ExpoPushMessage[] = [];
      const logs: any[] = [];
      for (const film of utazuNewEnglish) {
        const title =
          film.status === 'now_showing'
            ? 'Now showing in English at Utazu'
            : 'Upcoming in English at Utazu';
        for (const to of targets) {
          messages.push({
            to,
            title,
            body: film.title,
            sound: 'default',
            channelId: 'default',
            data: { screen: `/film/${film.id}`, filmId: film.id },
          });
        }
        logs.push({ film_id: film.id, type: film.status, title, body: film.title });
      }
      await sendExpoPush(messages);
      if (logs.length) await supabase.from('notifications_log').insert(logs);
    }
  }

  return Response.json({ ok: true, results, notified: utazuNewEnglish.length });
});
