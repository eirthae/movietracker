# Changelog

All notable changes to Cinema Tracker are documented here. Data-model and
data-source details live in [docs/DATA.md](docs/DATA.md); the product spec is
[docs/SPEC.md](docs/SPEC.md).

## [2.1.2] — 2026-07-14

### Changed
- Tapping an already-selected showtime now **deselects** it — the Add to
  Google Calendar button disappears with it. (Tapping a different time still
  just moves the selection.)

## [2.1.1] — 2026-07-14

### Fixed
- **Bottom tab bar (Cinemas / Settings) missing in the installed app.**
  `viewport-fit=cover` made the standalone PWA draw edge-to-edge behind the
  Android system navigation bar; on nav styles where the safe-area inset is 0,
  the tab bar ended up underneath it. Dropped `viewport-fit=cover` so the
  layout stays within the safe area, gave the tab bar `flex-shrink: 0` and a
  larger minimum bottom padding. Reinstall (or refresh) to pick it up.

## [2.1.0] — 2026-07-14

### Added
- **TOHO Cinemas support** — paste a TOHO schedule URL
  (`hlo.tohotheater.jp/net/schedule/{site}/…`). Uses TOHO's JSON API
  (api2.tohotheater.jp); gives Japanese + English titles, runtimes, and
  per-screening 字幕/吹替 language detection. Format variants (MX4D, 轟音上映)
  appear as their own cards.
- **Parks Cinema / SMT support** — paste a site URL like
  `parkscinema.com/site/namba/` (also works for `*.smt-cinema.com` sites).
  Parses the weekly schedule fragment; covers the current week (the weekly
  cron keeps it rolling).
- **Per-device cinema lists**: the Supabase DB is a shared catalogue (each
  cinema is scraped once no matter how many people follow it), but which
  cinemas appear as tabs is now personal per browser (`ct.myCinemas` in
  localStorage). Adding a cinema someone else already added attaches
  instantly — "Already tracked — N films ready right away".

### Changed
- **Film detail page removed.** Picking a time on a film card reveals the
  Add to Google Calendar button right there (with the same one-time privacy
  prompt). Tapping a card no longer navigates.
- Japanese badge text is now **日本語** (was 日本).
- The big "Cinemas" heading on the home screen is gone.
- Settings "Data source" now reads AEON · TOHO · Parks.

### Notes
- Descriptions/cast/genres remain unavailable — none of the three chains
  publish them in a machine-readable form (verified). TMDB enrichment stays
  the future option.
- Existing users: cinema tabs are now per-device, so after updating you
  re-add your cinema once (it attaches to the existing data instantly).

## [2.0.3] — 2026-07-14

### Added
- **Installable as an app** ("Install app" / richer Add to Home screen on
  Android): PNG icons (192/512 + maskable, `public/icon-*.png`) and a minimal
  no-op service worker (`public/sw.js`) — the two things Chrome requires
  before offering a real install. On iPhone it's still Safari → Share →
  Add to Home Screen (Apple never prompts).

## [2.0.2] — 2026-07-14

### Added
- **Live hosting on GitHub Pages** — the app now deploys automatically to
  <https://eirthae.github.io/movietracker/> on every push to `main`
  (`.github/workflows/deploy.yml`; Supabase URL/key come from repo Actions
  variables). Includes an SPA fallback so deep links like `/film/…` work.

### Changed
- Router uses Vite's base URL so the app works under the `/movietracker/`
  path; PWA manifest paths made relative for the same reason.

## [2.0.1] — 2026-07-14

### Fixed
- **"permission denied" (42501) on every read/write with a fresh v2 schema.**
  Supabase's current default no longer auto-grants table privileges to the
  Data API roles for newly created tables; RLS policies alone aren't enough.
  New migration `20260714000000_data_api_grants.sql` grants SELECT to
  `anon`/`authenticated` and ALL to `service_role` on the four tables. Run
  `npx supabase db push` to apply.

## [2.0.0] — 2026-07-14

Full rebuild as a **web app**. The v1 Android app (Expo / React Native) was
removed; it is preserved in git history at commit `26b183a`.

### Added
- **Vite + React + TypeScript web app** with four screens implemented from the
  Claude Design mockups (`Cinema Tracker Mockups.dc.html`, the design source of
  truth): Cinemas, Film Detail, Settings, Add Cinema.
- **Add to Google Calendar** on the Film Detail screen: pick a date + time, the
  button opens Google Calendar's event template pre-filled with the film title
  (with ENG tag where relevant), the exact JST screening time, the film's real
  runtime from AEON data, and the cinema name as location. No API/OAuth needed.
- **Calendar privacy prompt**: the first tap on the calendar button shows a
  one-time consent sheet explaining that the app never connects to, sees, or
  stores anyone's calendar/account — the event is saved by the user in their
  own Google account, and the only data sent to Google is the event text.
  Designed for handing the app to friends.
- **First-run empty state**: the app ships with **zero cinemas**. A big
  centred ＋ button ("Add a cinema to get movies") leads to the Add Cinema
  screen; the regular Cinemas view appears once the first cinema is added.
- **Add Cinema screen** with live URL validation: pasting an AEON schedule URL
  auto-derives the short ID, checks the schedule endpoint, looks up the cinema
  name, and previews how many films were found before adding.
- `validate` action on the `manage-cinema` Edge Function (powers the preview).
- **Film runtime** (`films.duration_min`) captured from AEON's movie master
  (ISO 8601 duration) with per-screening start/end fallback — used for calendar
  event end times.
- **Mock data mode**: with no `.env` the app runs without a backend (also
  forced via `?mock`). It starts empty like a fresh install; adding `utazu` or
  `ayagawa` by URL unlocks bundled sample films that mirror the design mockups.
- Light/dark/system theme with instant switching, persisted in localStorage.
- PWA manifest + icon so the site can be added to the Android home screen.

### Changed
- **Data model** (breaking, see docs/DATA.md): films are now one row per
  (cinema, AEON movie identifier) via the new `films.source_id`; **language
  moved to screenings**, so one film card can mix ENG and 日本 showtimes —
  matching the design. v1 stored each language variant as a separate film.
- `cinemas.url_mobile` renamed to `cinemas.schedule_url`.
- Badge labels are now `ENG` / `日本` (v1 used ENGLISH/JAPANESE), per the design.
- English-titled films sort above Japanese-only films within each section.
- Adding a cinema scrapes it immediately (v1 behaviour kept), so the new tab
  has data right away.

### Removed
- The entire Expo / React Native app, EAS build config, and Expo push
  notification plumbing (`device_tokens`, `notifications_log`,
  `_shared/push.ts`). The Settings toggle for English-film notifications
  remains as a stored preference; actual web-push delivery is future work.
- The v1 written brief (`cinema-tracker-brief.md`) — superseded by
  docs/SPEC.md. Historical copy in git history.

### Database migration
- `20260713000000_web_rebuild.sql` drops all v1 tables (scraped data only —
  refilled by the next scrape) and recreates the v2 schema. **No seed data** —
  cinemas are added from the app. Run `npx supabase db push`, then re-deploy
  both Edge Functions.

## [1.0.0] — 2026-06-27

Initial version: Expo (React Native) Android app + Supabase backend tracking
AEON Utazu / Ayagawa schedules with English/Japanese detection, weekly scrape
cron, and Expo push notifications for new English films at Utazu.
