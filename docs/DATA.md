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
| `https://theater.aeoncinema.com/schedule/v2/data/{slug}/schedule.json?v={yyyyMMddHHmm}` | Per-cinema schedule: `{ "YYYYMMDD": { "<roomId>": [screening, …] } }` |
| `https://theater.aeoncinema.com/schedule/v2/data/__master/movies.json?v={yyyyMMddHH}` | Shared movie master (~4 MB, ~10k entries): `{ "<identifier>": { name:{en,ja}, duration:'PT1H59M', thumbnailUrl, … } }` |
| `https://www.aeoncinema.com/json/_theaters.json` | Facility index — cinema display names |

A screening carries `name.ja/en` (title with 字幕/吹替/SUB/DUB prefix),
`startDate`/`endDate` (UTC ISO — converted to JST), and
`superEvent.workPerformed.identifier` → key into the movie master.

> ⚠️ **The `?v=` stamp is mandatory.** These objects live in S3 behind
> CloudFront with `Expires: +31 days`, and the distribution keys its cache on
> the `v` query param *only* — any other param (`_dc=…`) or none at all
> collapses onto a single cache entry that can be a month old, and client
> `Cache-Control: no-cache` is ignored. On 2026-08-11 the bare URL still
> served the Jul 31 build (last screening date Aug 6). AEON's own widget
> stamps minute-granularity on schedules and hour-granularity on the movie
> master; we mirror it via `jstStamp()` in `_shared/types.ts`. The bare URL is
> also the object AEON deletes/replaces during its ~06:00 JST rebuild, which
> is where the daily cron's `HTTP 403` errors came from.

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

**Posters come from a separate pair of endpoints** — the schedule API's
`thumbnail` field is an empty string for every title, which is why TOHO cards
showed placeholders until v2.1.8:

| Endpoint | Content |
|---|---|
| `https://hlo.tohotheater.jp/data_net/json/movie/TNPI3090.JSON` | Now-showing movie master |
| `https://hlo.tohotheater.jp/data_net/json/movie/TNPI3080.JSON` | Coming-soon movie master |

Both return `{ data: [ { mcode, sakuhinGazouNm, name, … } ] }`; the image is
`https://www.tohotheater.jp/images_net/movie/{mcode}/{sakuhinGazouNm}` (the
`hlo.` host 302s there, so we link the target directly). Join on the schedule
entry's **`mcode`** (the work) rather than `code` (the screening version —
IMAX/MX4D/dubbed variants each get their own `code`, one shared `mcode`).
Fetched once per run and cached on `ScrapeContext`. Two caveats: TOHO
publishes only 4:3 stills (640×480 / 480×360), not portrait key art, so they
centre-crop into the 2:3 poster slot; and a handful of re-releases and event
screenings appear in neither master, so they keep the placeholder.

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
`20260714100000_multi_chain.sql` (chain/slug columns),
`20260811000000_shift_scrape_off_rebuild_window.sql` (cron → 07:15 JST),
`20260811010000_purge_expired_data.sql` (`purge_expired_data()`, see §5).

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
  `ct.myCinemas` (see §6).
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

- **Daily cron** (pg_cron inside the database,
  `20260811000000_shift_scrape_off_rebuild_window.sql`): `15 22 * * *` UTC =
  **07:15 JST every day**, invoking `scrape-cinemas` via pg_net. Daily (not
  weekly) so a single failed run self-heals within 24h; fetches also retry
  403/429/5xx with backoff. The time matters: the previous 06:00 JST slot sat
  inside AEON's nightly rebuild, when its schedule objects are briefly absent
  from S3 and every AEON cinema 403s (11 consecutive days of it, while TOHO
  and Parks succeeded in the same runs). The schedule publishes about a week
  and a half ahead.
- **Never persist an empty parse.** `scrape-cinemas` treats a zero-film result
  as an error, because `persistCinema` deletes anything not in the current
  run — a source mid-rebuild or an upstream shape change would otherwise wipe
  a working cinema. The run fails, the log records it, yesterday's data stays.

## 5. Retention

A successful scrape mirrors its source exactly (`persistCinema` deletes films
absent from the run and replaces surviving films' screenings wholesale), and
the sources only publish today-forward — so expired rows normally never
accumulate. They do when a scrape **fails**: that cinema keeps its last-known
rows, and once those dates pass they are invisible in the app (date chips
start at today) but still stored. AEON's Aug 1–11 outage left 127 dead
screenings on `utazu` and 206 on `ayagawa`.

`purge_expired_data()` closes that gap. `scrape-cinemas` calls it at the end of
every run, unconditionally, and reports the counts in its response:

1. `screenings` dated before today (JST — same horizon as `todayJst()`),
2. `films` left with no screenings (a finished run; adapters never emit a
   film with zero screenings, so this can't catch a live one),
3. `scrape_log` rows older than 90 days — a generous window, since it's the
   diagnostic trail that identified the AEON outage.

It is `security definer` with `execute` revoked from `anon`/`authenticated`
and granted only to `service_role`: the publishable key that ships in the
browser bundle must never reach a delete. Failures are swallowed so
housekeeping can't fail an otherwise-good scrape. Deleting a cinema row
cascades to its films and screenings (FKs), so removals need no cleanup.
- **On add:** `manage-cinema` scrapes a newly-added cinema immediately.
- **Manual:** invoke `scrape-cinemas` from the dashboard or CLI any time.
- The app itself never scrapes; it only reads Postgres (React Query,
  5-min staleTime, refetch on focus).

## 6. Client-side storage (privacy)

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

## 7. Mock data

With no `.env` (or with `?mock` in the URL) the app runs without a backend
using `src/lib/mock.ts`. It starts with zero cinemas, like a fresh install;
"adding" `cinema.aeoncinema.com/wm/utazu/` or `…/ayagawa/` unlocks bundled
sample films that mirror the design mockups, with dates generated relative to
today. Other slugs add an empty cinema.
