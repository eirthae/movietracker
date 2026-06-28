# Cinema Tracker

A personal Android app that tracks what's playing at AEON cinemas in Japan, with a
focus on **English-language availability** — answering "can I watch this in English,
and when?" Add any AEON cinema by URL; data refreshes automatically each week.

- **App:** React Native (Expo SDK 56, Expo Router, TypeScript)
- **Backend:** Supabase (Postgres + Edge Functions)
- **Design:** GitLab brand color system, light + dark themes
- **Data:** AEON's public schedule JSON API (no HTML scraping)

## How it works

```
Android app (Expo)  ──reads──►  Supabase Postgres  ◄──writes──  Edge Functions
  Cinemas / Settings              films, screenings,             scrape-cinemas (weekly cron)
  pull-to-refresh                 cinemas, scrape_log            manage-cinema  (add/delete)
                                                                      │ fetch JSON
                                                                      ▼
                                                          theater.aeoncinema.com
                                                          /schedule/v2/data/{slug}/…
```

Language is detected from each screening's title prefix: `字幕`/`SUB` → **English**,
`吹替`/`DUB` → **Japanese**.

## Project layout

```
src/
  app/                 # Expo Router routes
    (tabs)/            #   Cinemas + Settings tabs
    film/[id].tsx      #   Film detail (also the notification deep-link target)
    manage-cinemas.tsx #   Add/delete cinemas by URL
  components/          # FilmCard, LanguageBadge, ScreeningGroups, StaleBanner, …
  lib/                 # supabase client, react-query hooks, notifications, types
  theme/               # GitLab design tokens + ThemeProvider/useTheme
supabase/
  migrations/          # Postgres schema
  functions/           # scrape-cinemas, manage-cinema, _shared/
```

## Setup

### 1. Install + run the app
```bash
npm install
npx expo start            # press 'a' for Android, or scan with Expo Go
```
Env lives in `.env` (already set for this project; see `.env.example`).

### 2. Apply the database schema
```bash
npx supabase db push      # prompts for your DB password
```

### 3. Deploy the Edge Functions
```bash
npx supabase functions deploy scrape-cinemas
npx supabase functions deploy manage-cinema
npx supabase functions invoke scrape-cinemas --no-verify-jwt   # first data pull
```

### 4. Schedule the weekly scrape
Dashboard → Integrations → **Cron** → new job, `0 21 * * 0` (Mon 06:00 JST),
target the `scrape-cinemas` function. (See `supabase/functions/README.md`.)

### 5. Build the APK
```bash
npm i -g eas-cli          # or use npx eas
eas login                 # your Expo account
eas init                  # links the project (adds extra.eas.projectId)
eas build -p android --profile preview   # → installable APK
```
Bump `android.versionCode` in `app.json` before each build.

> **Notifications in a production APK** also need an FCM (Firebase) credential —
> `eas` walks you through it on first build, or run `eas credentials`.

## Status / acceptance

See `cinema-tracker-brief.md` for the full spec. TMDB / Global Upcoming was cut from
scope; notifications fire for new English films at Utazu.
