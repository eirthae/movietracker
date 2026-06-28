-- Cinema Tracker — initial schema
-- Tables are read-only via the anon/publishable key (RLS select policies).
-- All writes happen from Edge Functions using the service-role key (bypasses RLS).

-- ----------------------------------------------------------------------------
-- Cinemas (seeded config, not scraped)
-- ----------------------------------------------------------------------------
create table if not exists cinemas (
  id            text primary key,            -- 'utazu', 'ayagawa'
  name          text not null,               -- 'AEON Cinema Utazu'
  url_mobile    text not null,
  display_order int  not null default 0
);

-- ----------------------------------------------------------------------------
-- Films scraped from cinema sites
-- ----------------------------------------------------------------------------
create table if not exists films (
  id              uuid primary key default gen_random_uuid(),
  cinema_id       text references cinemas(id) on delete cascade,
  title           text not null,
  title_original  text,
  description     text,
  "cast"          text[] not null default '{}',
  poster_url      text,
  status          text not null check (status in ('now_showing', 'upcoming')),
  language        text not null default 'unknown' check (language in ('english', 'japanese', 'unknown')),
  run_from        date,
  run_to          date,
  source_url      text,                       -- deep link back to the AEON page
  first_seen_at   date not null default current_date,  -- set on INSERT, drives notifications
  last_scraped_at timestamptz not null default now(),
  -- upsert key: each language of a film is its own row (e.g. subtitled vs dubbed)
  unique (cinema_id, title, status, language)
);

create index if not exists films_cinema_status_idx on films (cinema_id, status);

-- ----------------------------------------------------------------------------
-- Screenings (date + times + language) for a film
-- ----------------------------------------------------------------------------
create table if not exists screenings (
  id        uuid primary key default gen_random_uuid(),
  film_id   uuid not null references films(id) on delete cascade,
  date      date not null,
  times     text[] not null default '{}',     -- ['10:00', '13:30', '19:15']
  language  text not null check (language in ('english', 'japanese', 'unknown')),
  screen    text                              -- hall/screen label if available
);

create index if not exists screenings_film_idx on screenings (film_id);
create index if not exists screenings_date_idx on screenings (date);

-- ----------------------------------------------------------------------------
-- Scrape / sync run log
-- ----------------------------------------------------------------------------
create table if not exists scrape_log (
  id          uuid primary key default gen_random_uuid(),
  cinema_id   text,                           -- null for tmdb sync
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  status      text check (status in ('success', 'error')),
  error_msg   text
);

create index if not exists scrape_log_cinema_started_idx on scrape_log (cinema_id, started_at desc);

-- ----------------------------------------------------------------------------
-- Notifications sent log (one row per push sent)
-- ----------------------------------------------------------------------------
create table if not exists notifications_log (
  id         uuid primary key default gen_random_uuid(),
  film_id    uuid references films(id) on delete set null,
  type       text check (type in ('now_showing', 'upcoming')),
  title      text,
  body       text,
  sent_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Device push tokens (single-user, but supports rotation / multiple installs)
-- ----------------------------------------------------------------------------
create table if not exists device_tokens (
  id         uuid primary key default gen_random_uuid(),
  token      text not null unique,
  platform   text not null default 'android',
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Row Level Security: anon/publishable key gets read-only access.
-- Edge Functions use the service-role key, which bypasses RLS entirely.
-- ----------------------------------------------------------------------------
alter table cinemas           enable row level security;
alter table films             enable row level security;
alter table screenings        enable row level security;
alter table scrape_log        enable row level security;
alter table notifications_log enable row level security;
alter table device_tokens     enable row level security;

-- Public read policies (anon + authenticated)
create policy "public read cinemas"      on cinemas           for select using (true);
create policy "public read films"        on films             for select using (true);
create policy "public read screenings"   on screenings        for select using (true);
create policy "public read scrape_log"   on scrape_log        for select using (true);

-- device_tokens: the app needs to register/update its own token with the anon key.
-- Allow anon insert + update (single-user app; no sensitive data in the table).
create policy "anon insert device token" on device_tokens for insert with check (true);
create policy "anon update device token" on device_tokens for update using (true) with check (true);
create policy "anon read device token"   on device_tokens for select using (true);

-- notifications_log is written only by the Edge Function (service role); no anon policy needed.

-- ----------------------------------------------------------------------------
-- Seed cinemas
-- ----------------------------------------------------------------------------
insert into cinemas (id, name, url_mobile, display_order) values
  ('utazu',   'AEON Cinema Utazu',   'https://cinema.aeoncinema.com/wm/utazu/',   0),
  ('ayagawa', 'AEON Cinema Ayagawa', 'https://cinema.aeoncinema.com/wm/ayagawa/', 1)
on conflict (id) do nothing;
