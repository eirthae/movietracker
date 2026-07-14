-- Data API grants.
--
-- Supabase's current default no longer auto-grants table privileges to the
-- Data API roles for newly created tables (see config.toml note on
-- auto_expose_new_tables). RLS policies alone aren't enough — Postgres also
-- needs table-level GRANTs. Without these, the app gets "permission denied"
-- (42501) on every read, and the Edge Functions (service_role) can't write.

grant usage on schema public to anon, authenticated, service_role;

-- App reads (RLS "public read" policies still apply on top of these).
grant select on table public.cinemas, public.films, public.screenings, public.scrape_log
  to anon, authenticated;

-- Edge Function writes (service_role bypasses RLS but still needs privileges).
grant all on table public.cinemas, public.films, public.screenings, public.scrape_log
  to service_role;
