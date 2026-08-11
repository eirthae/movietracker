-- Purge expired schedule data.
--
-- persistCinema mirrors each source on a SUCCESSFUL scrape, so expired rows
-- normally vanish on their own. They do not when a scrape FAILS: the cinema
-- keeps its last-known rows and those age into pure dead weight — invisible in
-- the app (date chips start at today) but still occupying Postgres. AEON's
-- Aug 1-11 outage left 127 such screenings on utazu and 206 on ayagawa.
--
-- scrape-cinemas calls this at the end of every run, independent of whether
-- any cinema scraped cleanly, so expired rows cannot outlive their usefulness
-- even while a source is down.

create or replace function public.purge_expired_data(retain_log_days int default 90)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  -- The app's horizon is "today in JST", matching todayJst() in the adapters.
  today          date := (now() at time zone 'Asia/Tokyo')::date;
  del_screenings int;
  del_films      int;
  del_logs       int;
begin
  delete from screenings where date < today;
  get diagnostics del_screenings = row_count;

  -- A film with no screenings left is a finished run: adapters never emit one
  -- (FilmBucketMap.toFilms drops empty films), so this only catches films
  -- whose dates have all expired.
  delete from films f
  where not exists (select 1 from screenings s where s.film_id = f.id);
  get diagnostics del_films = row_count;

  -- The log is the diagnostic trail (11 days of it identified the AEON
  -- outage), so keep a generous window rather than trimming aggressively.
  delete from scrape_log
  where started_at < now() - make_interval(days => retain_log_days);
  get diagnostics del_logs = row_count;

  return jsonb_build_object(
    'screenings', del_screenings,
    'films', del_films,
    'scrape_log', del_logs
  );
end;
$$;

-- Deletes must never be reachable with the publishable key.
revoke all on function public.purge_expired_data(int) from public, anon, authenticated;
grant execute on function public.purge_expired_data(int) to service_role;
