# Cinema Tracker — Claude Code project instructions

Personal, mobile-first web app tracking what's playing at Japanese cinemas
(AEON / TOHO / Parks), focused on "can I watch this in English, and when?".
Single owner (GitHub: `eirthae`), shared with friends as a PWA.

- **Live app:** https://eirthae.github.io/movietracker/ (GitHub Pages,
  auto-deploys from `main`)
- **Docs:** [docs/SPEC.md](docs/SPEC.md) (product spec) ·
  [docs/DATA.md](docs/DATA.md) (data model, sources, privacy) ·
  [CHANGELOG.md](CHANGELOG.md)
- **Design source of truth:** `Cinema Tracker Mockups.dc.html` in Claude
  Design project `fe3b54ba-82ef-4886-9921-05945ac4e9bb` (claude.ai/design).
  When code/docs and the design disagree, **the design wins** — but several
  user-requested changes supersede it (no film-detail page, no "Cinemas"
  header, inline calendar button, 日本語 badge text; see SPEC).

## Standing rules from the user

1. **Every meaningful change updates CHANGELOG.md and (if data-related)
   docs/DATA.md.** This is an explicit standing instruction.
2. **User-visible changes ship as a release:** bump `package.json` version →
   CHANGELOG entry → commit → push → wait for the Pages deploy →
   `gh release create vX.Y.Z --latest`. Backend/docs-only tweaks may skip the
   release but still get changelog entries.
3. **Privacy is a feature.** No accounts, no personal data server-side.
   Google Calendar is a prefilled-URL template (no OAuth, nothing stored) with
   a one-time consent sheet. Each device keeps its own cinema list in
   localStorage (`ct.myCinemas`); the Supabase DB only holds shared schedule
   data.
4. Language badges say **ENG** and **日本語** (never "JAPANESE"/"日本").
5. The app ships with **zero cinemas** (big ＋ empty state); users add their
   own by pasting a schedule URL.
6. Date chips start at **today** — never show past days.

## Architecture (30 seconds)

```
React app (Vite, src/) ──reads──► Supabase Postgres ◄──writes── Edge Functions (Deno)
   Pages: Cinemas / Settings /       cinemas, films,              scrape-cinemas (pg_cron,
   Add Cinema (no detail page)       screenings, scrape_log       Mon 06:00 JST) and
   my-cinemas list in localStorage                                manage-cinema (validate/add)
                                                                     │ per-chain adapters
                                                                     ▼
                                          AEON JSON API · TOHO schedule API · Parks (Eigaland) API
```

- Chain adapters live in `supabase/functions/_shared/` (`aeon.ts`, `toho.ts`,
  `parks.ts`) behind `registry.ts` (`resolveUrl`, `adapterFor`). To support a
  new chain: write an adapter + register it + extend `src/lib/chains.ts`.
- Films are keyed by `(cinema_id, source_id)`; **language lives on
  screenings** (one film can mix ENG and 日本語 times). AEON provides no
  descriptions/cast/genres — those columns exist for future enrichment.
- All times/dates are **JST** strings; conversions happen at scrape time.

## Working on it

```bash
npm install
npm run dev          # http://localhost:5173 — mock mode without .env (or ?mock)
npm run typecheck    # tsc --noEmit
npm run build        # tsc + vite build (CI adds --base=/movietracker/)
```

`.env` (gitignored; both values are client-safe/public — they ship in the
bundle and RLS keeps the DB read-only):

```
VITE_SUPABASE_URL=https://eisjffdxhbvophyaczbt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_JVpNePRSNP5f6jyH6i0BAA_caZMvsGw
```

### Backend (Supabase project `eisjffdxhbvophyaczbt`, name "Movietracker")

```bash
npx supabase login                                    # one-time per machine
npx supabase link --project-ref eisjffdxhbvophyaczbt  # one-time per machine
npx supabase db push                                  # apply new migrations
npx supabase functions deploy scrape-cinemas --use-api   # --use-api: no Docker needed
npx supabase functions deploy manage-cinema --use-api
```

- Weekly scrape is scheduled **inside the DB** (pg_cron migration
  `20260721000000_weekly_scrape_cron.sql`) — no dashboard cron.
- Manual refresh: POST the `scrape-cinemas` function URL with the publishable
  key as `apikey`/`Bearer` (verify_jwt is off).
- ⚠️ Any **new table** needs explicit `GRANT`s to `anon, authenticated,
  service_role` (see `20260714000000_data_api_grants.sql`) or every request
  fails with Postgres 42501 — Supabase no longer auto-grants.

### Deploy & release

- Push to `main` → `.github/workflows/deploy.yml` builds (repo Actions
  variables hold the env) and publishes Pages. GitHub caches with
  `max-age=600`, so the live site can lag up to ~10 min.
- `gh` CLI is authenticated as `eirthae` (repo owner) for pushes/releases.

## Gotchas learned the hard way

- **PWA icons:** phones only re-download icons when the *manifest text*
  changes — changing icon art requires new filenames (currently
  `icon-*-v2.png`).
- **PowerShell 5.1** (dev machine is Windows): no `&&`, no ternary; double
  quotes inside `git commit -m @'…'@` here-strings get mangled — avoid them.
- The app deliberately has a **no-op service worker** (`public/sw.js`) — it
  exists only for installability; don't add caching (weekly data + tiny app).
- Old v1 (Expo/React Native Android app) lives in git history at `26b183a`;
  don't resurrect it.
