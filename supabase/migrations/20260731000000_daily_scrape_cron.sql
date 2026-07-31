-- Scrape daily instead of weekly.
--
-- The Jul 27 weekly run got a transient 403 from AEON's bot protection and
-- the app went stale for days (date chips start at today, so once data ages
-- past the horizon, no showtimes render at all). Daily runs self-heal any
-- single failure within 24h and pick up mid-week advance tickets.

do $$
begin
  if exists (select 1 from cron.job where jobname = 'weekly-scrape-cinemas') then
    perform cron.unschedule('weekly-scrape-cinemas');
  end if;
  if exists (select 1 from cron.job where jobname = 'daily-scrape-cinemas') then
    perform cron.unschedule('daily-scrape-cinemas');
  end if;
end $$;

select cron.schedule(
  'daily-scrape-cinemas',
  '0 21 * * *',  -- 21:00 UTC = 06:00 JST, every day
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
