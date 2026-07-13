# Cinema Tracker — Data Reference

**Last updated:** 2026-07-14 · Keep this file current whenever the schema or
data sources change (see CHANGELOG.md for history).

## 1. Data sources (AEON Cinema)

AEON's schedule pages load their data from a public JSON API — we use it
directly, no HTML scraping:

| Endpoint | Content |
|---|---|
| `https://theater.aeoncinema.com/schedule/v2/data/{slug}/schedule.json` | Per-cinema schedule: `{ "YYYYMMDD": { "<roomId>": [screening, …] } }` |
| `https://theater.aeoncinema.com/schedule/v2/data/__master/movies.json` | Shared movie master (~4 MB, ~10k entries): `{ "<identifier>": { name:{en,ja}, duration:'PT1H59M', thumbnailUrl, datePublished, … } }` |
| `https://www.aeoncinema.com/json/_theaters.json` | Facility index — used to look up a cinema's display name from its slug |

A screening object carries: `name.ja/en` (title with 字幕/吹替/SUB/DUB prefix),
`startDate`/`endDate` (UTC ISO), `location.name.ja` (hall), and
`superEvent.workPerformed.identifier` → the key into the movie master.

**What AEON does *not* provide:** descriptions, cast, genres. The schema keeps
nullable columns for them (`description`, `cast`, `genres`) so a future TMDB
enrichment step can fill them; today they're only populated in mock data.

**Timezone:** AEON times are UTC in the JSON; we convert to JST (UTC+9)
strings at scrape time. Everything user-facing is JST.

## 2. Schema (Postgres / Supabase)

Migration: `supabase/migrations/20260713000000_web_rebuild.sql`

```
cinemas      id (slug, pk) · name · schedule_url · display_order · added_at
films        id (uuid) · cinema_id → cinemas · source_id (AEON identifier)
             title (ja) · title_original (en) · description · poster_url
             duration_min · genres[] · cast[] · status (now_showing|upcoming)
             run_from · run_to · source_url · first_seen_at · last_scraped_at
             UNIQUE (cinema_id, source_id)
screenings   id (uuid) · film_id → films · date · language (english|japanese|unknown)
             times[] ('HH:mm' JST)   UNIQUE (film_id, date, language)
scrape_log   id · cinema_id · started_at · finished_at · status (success|error) · error_msg
```

Key modelling decisions:

- **One film row per (cinema, AEON movie identifier).** The stable upsert key
  is `source_id` — titles and statuses can change week to week, identifiers
  don't.
- **Language lives on screenings**, one row per (film, date, language). A
  film's headline badge (ENG/日本) is derived client-side: English if *any*
  screening is English.
- **`status`** is computed at scrape time: `run_from > today(JST)` → upcoming.
- **`duration_min`** comes from the master's ISO 8601 `duration`, falling back
  to a screening's `endDate − startDate`. Used for Google Calendar end times
  (default 120 min if unknown).
- **Refresh strategy:** films are upserted; films that vanished from the
  schedule are deleted (cascades screenings); surviving films get their
  screenings replaced wholesale each run. `first_seen_at` keeps its INSERT
  default so "new this week" remains derivable.

## 3. Access model

- **Publishable key (browser):** SELECT-only on all four tables via RLS
  policies. Safe to ship in the client bundle.
- **Service-role key (Edge Functions only):** bypasses RLS for writes. Never
  leaves Supabase.
- Edge Functions have `verify_jwt = false` (see `supabase/config.toml`) —
  needed because the app calls `manage-cinema` with the publishable key and
  cron invokes `scrape-cinemas` directly. Single-user app, low-risk surface.

## 4. Refresh cadence

- **Weekly cron** (Supabase Dashboard → Integrations → Cron):
  `0 21 * * 0` UTC = **Monday 06:00 JST**, targeting `scrape-cinemas`.
  AEON's cinema week starts on... the schedule publishes about a week ahead;
  a Monday-morning pull captures the fresh week.
- **On add:** `manage-cinema` scrapes a newly-added cinema immediately.
- **Manual:** invoke `scrape-cinemas` from the dashboard or CLI any time.
- The app itself never scrapes; it only reads Postgres (React Query,
  5-min staleTime, refetch on focus).

## 5. Client-side storage (privacy)

Nothing personal is stored server-side. The browser's localStorage holds only:

| Key | Content |
|---|---|
| `ct.theme` | `system` / `light` / `dark` |
| `ct.notifyEnglish` | notifications toggle (`on`/`off`) |
| `ct.calendarConsent` | `yes` once the one-time calendar privacy prompt was accepted |
| `ct.mockCinemas` | mock mode only: cinemas "added" without a backend |

Google Calendar is never connected: the calendar button opens Google's event
template URL (`calendar.google.com/calendar/render?action=TEMPLATE&…`) in the
user's own session. The only data in that URL is the event itself — film
title, time, cinema name, and the AEON link.

## 6. Mock data

With no `.env` (or with `?mock` in the URL) the app runs without a backend
using `src/lib/mock.ts`. It starts with zero cinemas, like a fresh install;
"adding" `cinema.aeoncinema.com/wm/utazu/` or `…/ayagawa/` unlocks bundled
sample films that mirror the design mockups, with dates generated relative to
today. Other slugs add an empty cinema.
