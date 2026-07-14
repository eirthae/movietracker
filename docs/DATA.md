# Cinema Tracker — Data Reference

**Last updated:** 2026-07-14 · Keep this file current whenever the schema or
data sources change (see CHANGELOG.md for history).

## 1. Data sources (three chains, one adapter each)

Adapters live in `supabase/functions/_shared/` (`aeon.ts`, `toho.ts`,
`parks.ts`, dispatched via `registry.ts`).

### AEON Cinema (`chain = 'aeon'`)

Public JSON API — no HTML scraping:

| Endpoint | Content |
|---|---|
| `https://theater.aeoncinema.com/schedule/v2/data/{slug}/schedule.json` | Per-cinema schedule: `{ "YYYYMMDD": { "<roomId>": [screening, …] } }` |
| `https://theater.aeoncinema.com/schedule/v2/data/__master/movies.json` | Shared movie master (~4 MB, ~10k entries): `{ "<identifier>": { name:{en,ja}, duration:'PT1H59M', thumbnailUrl, … } }` |
| `https://www.aeoncinema.com/json/_theaters.json` | Facility index — cinema display names |

A screening carries `name.ja/en` (title with 字幕/吹替/SUB/DUB prefix),
`startDate`/`endDate` (UTC ISO — converted to JST), and
`superEvent.workPerformed.identifier` → key into the movie master.

### TOHO Cinemas (`chain = 'toho'`, slug = 3-digit site code)

JSON API behind the schedule pages, one request per day (we sweep 14 days):

```
https://api2.tohotheater.jp/api/schedule/v1/schedule/{site}/TNPI3050J02
  ?__type__=json&__useResultInfo__=no&vg_cd={site}&show_day=YYYYMMDD
  &term=99&isMember=&enter_kbn=&_dc={unix}
```

Gives per-site movies (`name` JA / `ename` EN — full-width, normalized with
NFKC; `hours` = runtime) with per-screen `showingStart` times (already JST).
Language markers （字幕版）/（吹替版） are in the titles; each format variant
(MX4D, 轟音上映…) is its own movie code → its own card. ⚠️ `showDay` in the
response is an object, not a string — we date rows by the requested day.

### Parks Cinema / SMT (`chain = 'parks'`)

Server-rendered weekly schedule fragment (works for `parkscinema.com` and
`*.smt-cinema.com` sites):

1. `{origin}/site/{slug}/week.html` → `thnumber="1070"` + cinema name in `<title>`
2. `{origin}/schedule/pc/s0200_{thnumber}.html` → one `<tr>` per film version:
   `<h2>` title (with 字幕版/吹替版 markers), `（本編：163分）` runtime,
   `movie_data/…_leafletimg_s.jpg` poster, one `<td>` per day with
   `screendate=YYYYMMDD` and `<p>15:00</p>` times (未定 = TBD).

Covers the **current week only**; the weekly cron keeps it rolling.
⚠️ Encoding is mixed (site pages Shift_JIS, fragments UTF-8) — `getText()`
sniffs strict-UTF-8-first with Shift_JIS fallback.

### What no chain provides

Descriptions, cast, genres — verified unavailable in machine-readable form on
all three. Nullable columns (`description`, `cast`, `genres`) are kept for a
future TMDB enrichment step; today they only show in mock data.

**Timezone:** everything user-facing is JST.

## 2. Schema (Postgres / Supabase)

Migration: `supabase/migrations/20260713000000_web_rebuild.sql`

Migrations since: `20260714000000_data_api_grants.sql` (Data API GRANTs),
`20260714100000_multi_chain.sql` (chain/slug columns).

```
cinemas      id (pk: 'utazu', 'toho-032', 'parks-namba') · chain · slug
             name · schedule_url · display_order · added_at
films        id (uuid) · cinema_id → cinemas · source_id (chain's movie id)
             title (ja) · title_original (en) · description · poster_url
             duration_min · genres[] · cast[] · status (now_showing|upcoming)
             run_from · run_to · source_url · first_seen_at · last_scraped_at
             UNIQUE (cinema_id, source_id)
screenings   id (uuid) · film_id → films · date · language (english|japanese|unknown)
             times[] ('HH:mm' JST)   UNIQUE (film_id, date, language)
scrape_log   id · cinema_id · started_at · finished_at · status (success|error) · error_msg
```

Key modelling decisions:

- **One film row per (cinema, chain movie identifier).** The stable upsert key
  is `source_id` — titles and statuses can change week to week, identifiers
  don't.
- **The DB is a shared catalogue; cinema lists are per device.** Every user of
  the app reads the same rows, and a cinema is scraped once regardless of how
  many people follow it. Which cinemas show as tabs lives in each browser's
  `ct.myCinemas` (see §5).
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
- **Explicit grants required:** Supabase no longer auto-grants table
  privileges to the Data API roles for new tables, so
  `20260714000000_data_api_grants.sql` adds them (SELECT for
  anon/authenticated, ALL for service_role). Any future table needs the same
  treatment or every request fails with Postgres error 42501.
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
| `ct.myCinemas` | this device's cinema list (`[{id, name}]`) — tabs are personal even though film data is shared |

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
