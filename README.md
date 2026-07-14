# Cinema Tracker

**Live app: <https://eirthae.github.io/movietracker/>** (auto-deployed from
`main` via GitHub Pages)

A personal, mobile-first **web app** that tracks what's playing at AEON
cinemas in Japan, focused on **English-language availability** — answering
"can I watch this in English, and when?" Add any AEON cinema by URL, pick a
showtime, and add it straight to Google Calendar. Data refreshes automatically
each week.

- **App:** Vite + React + TypeScript (React Query, React Router)
- **Backend:** Supabase (Postgres + Edge Functions)
- **Design:** `Cinema Tracker Mockups.dc.html` (Claude Design) — GitLab brand
  palette, light + dark themes
- **Data:** AEON's public schedule JSON API (no HTML scraping)

Docs: [SPEC](docs/SPEC.md) · [DATA](docs/DATA.md) · [CHANGELOG](CHANGELOG.md)

## How it works

```
Web app (browser)  ──reads──►  Supabase Postgres  ◄──writes──  Edge Functions
  Cinemas / Detail /             cinemas, films,               scrape-cinemas (weekly cron)
  Settings / Add Cinema          screenings, scrape_log        manage-cinema  (validate/add)
        │                                                           │ fetch JSON
        ▼                                                           ▼
  Google Calendar                                       theater.aeoncinema.com
  (event template URL)                                  /schedule/v2/data/{slug}/…
```

Language is detected per screening from the title prefix: `字幕`/`SUB` →
**ENG**, `吹替`/`DUB` (or no prefix) → **日本**.

## Project layout

```
src/
  pages/          # CinemasPage, FilmDetailPage, SettingsPage, AddCinemaPage
  components/     # FilmCard, ScreeningPicker (date/time chips), Poster, TabBar
  lib/            # supabase client, react-query hooks, calendar URL builder,
                  # prefs (theme), formatting, mock data
  styles/         # tokens.css (design tokens, dark+light), app.css
supabase/
  migrations/     # Postgres schema (v2: 20260713000000_web_rebuild.sql)
  functions/      # scrape-cinemas, manage-cinema, _shared/ (AEON adapter)
docs/             # SPEC.md, DATA.md
```

## Setup

### 1. Run the app

```bash
npm install
npm run dev            # http://localhost:5173
```

With no `.env` the app runs in **mock mode** (also forced by `?mock`): it
starts empty like a fresh install, and adding `cinema.aeoncinema.com/wm/utazu/`
or `…/ayagawa/` unlocks bundled sample films. For real data, copy
`.env.example` to `.env` and fill in your Supabase URL + publishable key.

The app **ships with no cinemas** — everyone adds their own from the big ＋ on
first launch (or the ＋ next to the cinema tabs).

### 2. Apply the database schema

```bash
npx supabase db push   # prompts for your DB password
```

> v2 note: this migration **drops the v1 tables** (scraped data only) and
> recreates the new schema with no seed data. See CHANGELOG 2.0.0.

### 3. Deploy the Edge Functions

```bash
npx supabase functions deploy scrape-cinemas
npx supabase functions deploy manage-cinema
npx supabase functions invoke scrape-cinemas --no-verify-jwt   # first data pull
```

### 4. Schedule the weekly scrape

Dashboard → Integrations → **Cron** → new job, `0 21 * * 0` (Mon 06:00 JST),
target the `scrape-cinemas` function. (See `supabase/functions/README.md`.)

### 5. Deploy the app (optional)

`npm run build` produces a static `dist/` — host it anywhere (Netlify, Vercel,
Cloudflare Pages, GitHub Pages). On Android, "Add to Home screen" installs it
like an app (PWA manifest included).

## Privacy (for anyone you share it with)

No accounts, no login, no personal data stored anywhere. "Add to Google
Calendar" never connects to your calendar — it opens Google Calendar in your
own browser with the event pre-filled, and you save it yourself. A one-time
prompt in the app explains this on first use. Preferences (theme, toggles)
stay in your browser's localStorage. Details: [docs/DATA.md](docs/DATA.md) §5.

## Status

All four design screens implemented and verified against the mockups.
Notification *delivery* (web push) is future work — the Settings toggle stores
the preference. See [docs/SPEC.md](docs/SPEC.md) §6 for the full
out-of-scope list.
