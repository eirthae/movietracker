-- Weekly scrape cron, self-contained in the database (no dashboard setup).
--
-- pg_cron fires every Sunday 21:00 UTC (= Monday 06:00 JST) and pg_net POSTs
-- to the scrape-cinemas Edge Function, which refreshes every cinema.
-- The function has verify_jwt = false; the header below is the public
-- (publishable) key, which is client-safe by design.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Re-runnable: drop an existing job with the same name first.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'weekly-scrape-cinemas') then
    perform cron.unschedule('weekly-scrape-cinemas');
  end if;
end $$;

select cron.schedule(
  'weekly-scrape-cinemas',
  '0 21 * * 0',  -- Sun 21:00 UTC = Mon 06:00 JST
  $$
  select net.http_post(
    url := 'https://eisjffdxhbvophyaczbt.supabase.co/functions/v1/scrape-cinemas',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_JVpNePRSNP5f6jyH6i0BAA_caZMvsGw'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  )
  $$
);
