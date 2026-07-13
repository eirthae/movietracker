-- Cinema Tracker v2 (web rebuild) — fresh schema.
--
-- Drops the v1 tables outright: they held only scraped data (re-fetched by the
-- next scrape run) plus Expo push tokens that the web app no longer uses.
-- Model change from v1: a film is one row per (cinema, AEON movie identifier);
-- language now lives on each screening, so one card can mix ENG and 日本 times.

drop table if exists notifications_log cascade;
drop table if exists device_tokens cascade;
drop table if exists screenings cascade;
drop table if exists films cascade;
drop table if exists scrape_log cascade;
drop table if exists cinemas cascade;

-- ----------------------------------------------------------------------------
-- Cinemas (added from the app via the manage-cinema function, or seeded below)
-- ----------------------------------------------------------------------------
create table cinemas (
  id            text primary key,            -- AEON slug: 'utazu', 'ayagawa'
  name          text not null,               -- 'AEON Cinema Utazu'
  schedule_url  text not null,               -- https://cinema.aeoncinema.com/wm/{slug}/
  display_order int  not null default 0,
  added_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Films — one row per (cinema, AEON movie identifier)
-- ----------------------------------------------------------------------------
create table films (
  id              uuid primary key default gen_random_uuid(),
  cinema_id       text not null references cinemas(id) on delete cascade,
  source_id       text not null,             -- AEON master movie identifier
  title           text not null,             -- Japanese display title (cleaned)
  title_original  text,                      -- English title when different
  description     text,                      -- not in AEON's API; future enrichment
  poster_url      text,
  duration_min    int,                       -- from master 'PT1H59M' or start/end diff
  genres          text[] not null default '{}',  -- not in AEON's API; future enrichment
  "cast"          text[] not null default '{}',  -- not in AEON's API; future enrichment
  status          text not null check (status in ('now_showing', 'upcoming')),
  run_from        date,
  run_to          date,
  source_url      text,                      -- deep link back to the AEON page
  first_seen_at   date not null default current_date,
  last_scraped_at timestamptz not null default now(),
  unique (cinema_id, source_id)
);

create index films_cinema_status_idx on films (cinema_id, status);

-- ----------------------------------------------------------------------------
-- Screenings — per film, per date, per language
-- ----------------------------------------------------------------------------
create table screenings (
  id        uuid primary key default gen_random_uuid(),
  film_id   uuid not null references films(id) on delete cascade,
  date      date not null,
  language  text not null check (language in ('english', 'japanese', 'unknown')),
  times     text[] not null default '{}',    -- ['10:00', '13:30', '19:15'] (JST)
  unique (film_id, date, language)
);

create index screenings_film_idx on screenings (film_id);

-- ----------------------------------------------------------------------------
-- Scrape run log — powers the "Updated Mon 23 Jun" labels + Settings "Last scrape"
-- ----------------------------------------------------------------------------
create table scrape_log (
  id          uuid primary key default gen_random_uuid(),
  cinema_id   text,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  status      text check (status in ('success', 'error')),
  error_msg   text
);

create index scrape_log_cinema_started_idx on scrape_log (cinema_id, started_at desc);

-- ----------------------------------------------------------------------------
-- RLS: anon/publishable key is read-only; Edge Functions write with the
-- service-role key, which bypasses RLS.
-- ----------------------------------------------------------------------------
alter table cinemas    enable row level security;
alter table films      enable row level security;
alter table screenings enable row level security;
alter table scrape_log enable row level security;

create policy "public read cinemas"    on cinemas    for select using (true);
create policy "public read films"      on films      for select using (true);
create policy "public read screenings" on screenings for select using (true);
create policy "public read scrape_log" on scrape_log for select using (true);

-- No seed data: the app ships with zero cinemas. Users add their own from the
-- Add Cinema screen (manage-cinema function), which scrapes immediately.
