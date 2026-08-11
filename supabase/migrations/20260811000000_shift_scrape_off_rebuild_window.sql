-- Move the daily scrape off AEON's rebuild window.
--
-- Every run at 21:00 UTC (06:00 JST) failed with "HTTP 403" for utazu and
-- ayagawa — 11 days straight — while TOHO and Parks succeeded in the same run,
-- and manual invokes at any other hour succeeded. AEON deletes and re-uploads
-- its per-theatre schedule objects during that window, so the origin has no
-- object to serve and S3 answers 403.
--
-- The real fix is the `?v=` cache-buster in _shared/aeon.ts (the bare URL both
-- collided with this window and served month-old cached data). Shifting the
-- schedule is defence in depth: 22:15 UTC = 07:15 JST, clear of the rebuild
-- and still before the user's morning.

do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-scrape-cinemas') then
    perform cron.unschedule('daily-scrape-cinemas');
  end if;
end $$;

select cron.schedule(
  'daily-scrape-cinemas',
  '15 22 * * *',  -- 22:15 UTC = 07:15 JST, every day
  $$
  select net.http_post(
    url := 'https://eisjffdxhbvophyaczbt.supabase.co/functions/v1/scrape-cinemas',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_JVpNePRSNP5f6jyH6i0BAA_caZMvsGw'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 300000
  )
  $$
);
