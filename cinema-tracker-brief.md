# Cinema Tracker — Design, Development & Experience Brief

**Version:** 1.2  
**Date:** June 2026  
**Author:** [Your name]  
**Status:** Draft

---

## 1. Overview

A personal Android app (APK) that tracks what's playing at two AEON cinemas in Kagawa, Japan, surfaces upcoming releases per cinema, and maintains a broader list of notable upcoming Western / Hollywood films — with a focus on English-language availability. Backend is Supabase (Postgres + Edge Functions). The core job: answer "can I watch this in English, and when?"

---

## 2. Problem Statement

Living in Japan and relying on local cinema websites is tedious. The sites are in Japanese, navigation is non-trivial, scheduling is buried, and there's no fast way to know whether a film is showing in English or Japanese. This app consolidates that into a single, clean, automatically-refreshed view on your phone.

---

## 3. Target User

Single user (the owner). Android phone only. Low maintenance — the app should refresh itself on schedule with no manual intervention required.

---

## 4. Scope

### 4.1 In scope

- Supabase Edge Function that scrapes two AEON cinema websites on a weekly schedule
- Supabase Edge Function that syncs TMDB upcoming Western releases weekly
- React Native (Expo) Android app consuming data from Supabase
- Now-showing and upcoming films per cinema (tabbed)
- Global Upcoming section for Western / Hollywood releases with genre filter
- English / Japanese language badges per film / per screening
- Pull-to-refresh in app
- Ability to add additional cinemas via config (no UI required for v1)

### 4.2 Out of scope (v1)

- iOS build
- Push notifications (v2 candidate)
- Ticket booking integration
- Watchlist / saved films
- Admin UI for manual data overrides

---

## 5. Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Android App (APK)                  │
│              React Native + Expo                     │
│                                                      │
│  Tab: Utazu | Tab: Ayagawa | Section: Global        │
│  ↕ pull-to-refresh   ↕ reads Supabase directly      │
└───────────────────┬─────────────────────────────────┘
                    │ Supabase JS client (anon key)
                    ▼
┌─────────────────────────────────────────────────────┐
│                    Supabase                          │
│                                                      │
│  Postgres DB          Edge Functions                 │
│  ┌─────────────┐     ┌────────────────────────┐    │
│  │ films        │     │ scrape-cinemas          │    │
│  │ screenings   │◄────│ (weekly cron, Cheerio)  │    │
│  │ global_films │     ├────────────────────────┤    │
│  │ cinemas      │     │ sync-tmdb               │    │
│  └─────────────┘     │ (weekly cron, TMDB API) │    │
│                       └────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                    │
        scrapes ▼           syncs ▼
┌──────────────────┐   ┌──────────────────┐
│ AEON mobile pages│   │   TMDB API       │
│ cinema.aeoncinema│   │ /movie/upcoming  │
│ .com/wm/{slug}/  │   │ region=US        │
└──────────────────┘   └──────────────────┘
```

---

## 6. Cinema Sources

| ID | Name | Schedule URL (scrape target) |
|----|------|------------------------------|
| `utazu` | AEON Cinema Utazu *(default tab)* | `cinema.aeoncinema.com/wm/utazu/` |
| `ayagawa` | AEON Cinema Ayagawa | `cinema.aeoncinema.com/wm/ayagawa/` |

**Scraping notes:**
- Mobile schedule pages are static HTML → Cheerio (no headless browser needed)
- Language signals: `字幕` (jimaku) = English, `吹替` (fukikae) = Japanese, detected at screening level
- Playwright is not required; Deno (Edge Function runtime) + a fetch + Cheerio port handles this fine
- Each cinema has its own adapter module within the Edge Function

---

## 7. Database Schema (Supabase / Postgres)

```sql
-- Cinema config (seeded, not scraped)
create table cinemas (
  id          text primary key,       -- 'utazu', 'ayagawa'
  name        text not null,          -- 'AEON Cinema Utazu'
  url_mobile  text not null,
  display_order int default 0
);

-- Films scraped from cinema sites
create table films (
  id              uuid primary key default gen_random_uuid(),
  cinema_id       text references cinemas(id),
  title           text not null,
  title_original  text,
  description     text,
  cast            text[],
  poster_url      text,
  status          text check (status in ('now_showing', 'upcoming')),
  run_from        date,
  run_to          date,
  last_scraped_at timestamptz default now()
);

-- Individual screenings (date + times + language)
create table screenings (
  id        uuid primary key default gen_random_uuid(),
  film_id   uuid references films(id) on delete cascade,
  date      date not null,
  times     text[],           -- ['10:00', '13:30', '19:15']
  language  text check (language in ('english', 'japanese', 'unknown')),
  screen    text              -- hall/screen label if available
);

-- Global upcoming Western/Hollywood releases (from TMDB)
create table global_films (
  id            uuid primary key default gen_random_uuid(),
  tmdb_id       integer unique not null,
  title         text not null,
  description   text,
  cast          text[],
  poster_url    text,
  genres        text[],
  release_date  date,
  language      text check (language in ('english', 'unknown')) default 'english',
  trailer_url   text,
  last_synced_at timestamptz default now()
);

-- Scrape run log
create table scrape_log (
  id          uuid primary key default gen_random_uuid(),
  cinema_id   text,           -- null for tmdb sync
  started_at  timestamptz default now(),
  finished_at timestamptz,
  status      text check (status in ('success', 'error')),
  error_msg   text
);
```

**Row Level Security:** Tables are read-only via anon key. Edge Functions use the service role key for writes. No auth required in the app.

---

## 8. Supabase Edge Functions

### 8.1 `scrape-cinemas`

- **Trigger:** Supabase cron — every Monday 06:00 JST (`0 21 * * 0` UTC)
- **Runtime:** Deno (Edge Function default)
- **Dependencies:** `cheerio` (via npm compat), `@supabase/supabase-js`
- **Flow:**
  1. Read cinemas table for active cinema list
  2. For each cinema: fetch mobile schedule URL, parse HTML with Cheerio
  3. Extract: films (title, description, cast, poster, run dates, status)
  4. Extract: screenings per film (date, times, language from 字幕/吹替 labels)
  5. Upsert films by `(cinema_id, title, status)` — update existing, insert new
  6. Delete screenings for the film, re-insert fresh (schedule changes weekly)
  7. Write to `scrape_log`
- **Error isolation:** each cinema wrapped in try/catch; one failure doesn't abort others

### 8.2 `sync-tmdb`

- **Trigger:** Same cron as above (runs after cinema scrape)
- **Flow:**
  1. Call `TMDB GET /movie/upcoming?region=US&language=en-US`
  2. Filter: `original_language != 'ja'`, `release_date` within next 6 months
  3. For each film: fetch cast from `TMDB GET /movie/{id}/credits`
  4. Upsert into `global_films` by `tmdb_id`
  5. Write to `scrape_log`
- **API key:** stored in Supabase Edge Function secrets as `TMDB_API_KEY`

### 8.3 Manual trigger

Both functions are also invocable via Supabase dashboard → Edge Functions → Invoke, for on-demand refresh without waiting for the Monday cron.

---

## 9. Mobile App (React Native + Expo)

### 9.1 Tech choices

| Concern | Choice |
|---------|--------|
| Framework | Expo SDK (managed workflow) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Data fetching | TanStack Query (`@tanstack/react-query`) |
| Supabase client | `@supabase/supabase-js` |
| Styling | StyleSheet + design tokens (no Tailwind — RN doesn't support it) |
| Build | `eas build --platform android` → APK |

### 9.2 Screen structure

```
app/
  _layout.tsx          # root layout, Supabase client init, query client
  index.tsx            # Cinema screen (default — Utazu tab open)
  global.tsx           # Global Upcoming screen
```

**Bottom tab bar:**
- 🎬 Cinemas  (index)
- 🌍 Global Upcoming  (global)

### 9.3 Cinema screen

- Top tab bar within the screen: **AEON Utazu** · **AEON Ayagawa**
- Utazu is active by default
- Each cinema tab:
  - Pull-to-refresh triggers re-fetch from Supabase (not a re-scrape)
  - "Updated [date]" shown below tab label, from `scrape_log`
  - Now Showing section — card list, English screenings first
  - Coming Soon section — collapsible, below Now Showing

### 9.4 Global Upcoming screen

- Genre filter chips: scrollable horizontal row
  - All · Action · Adventure · Animation · Comedy · Drama · Fantasy · Horror · Sci-Fi · Thriller
  - Multi-select; filters client-side from cached query result
- Card list, sorted by release date ascending
- Pull-to-refresh

### 9.5 Film card (shared component)

```
┌─────────────────────────────────────┐
│ [POSTER]          [ENGLISH badge]   │
│  2:3 ratio        top-right corner  │
├─────────────────────────────────────┤
│ Title                               │
│ Original title (if different)       │
│ Run dates  ·  Genre tags            │
│ Description (3 lines, expandable)   │
│ Cast: Name, Name, Name              │
│                                     │
│ ▼ Screenings                        │
│   Sat 28 Jun   10:00  13:30  19:15  │
│   Sun 29 Jun   11:00  16:00         │
└─────────────────────────────────────┘
```

For Global Upcoming cards, screenings row is replaced by release date + trailer link.

---

## 10. Design System

**Reference:** [GitLab Brand Color System](https://design.gitlab.com/brand-design/color)

All colors implemented as a central `tokens.ts` file. Components reference tokens only — no raw hex values in component files.

### Color tokens

```ts
// tokens.ts
export const colors = {
  background:        '#1F1E24',   // GitLab dark base
  surface:           '#2B2A33',   // card background
  surfaceElevated:   '#363540',   // modals, bottom sheets
  accent:            '#7759C2',   // GitLab Purple — tabs, active states
  accentSubtle:      '#3D2F6B',   // pressed states

  badgeEnglish:      '#2DA160',   // GitLab Green
  badgeJapanese:     '#525160',   // neutral mid
  badgeUnknown:      'transparent',

  textPrimary:       '#FAFAFA',
  textSecondary:     '#A8A7B3',
  textMuted:         '#6E6D7A',

  border:            '#3D3C48',
  error:             '#C24040',   // GitLab Red
  success:           '#2DA160',
}
```

### Language badge spec

Position: absolute, top-right corner of poster image
```
ENGLISH   → bg: badgeEnglish, text: white, 600 weight, 10px, uppercase
JAPANESE  → bg: badgeJapanese, text: white, 600 weight, 10px, uppercase  
UNKNOWN   → border: 1px badgeJapanese, text: textMuted, 10px, uppercase
```
Padding: 4px vertical · 8px horizontal. Border radius: 4px.

### Typography scale

```ts
export const type = {
  title:       { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  titleSub:    { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  body:        { fontSize: 13, fontWeight: '400', color: colors.textPrimary },
  meta:        { fontSize: 12, fontWeight: '400', color: colors.textSecondary },
  screenTime:  { fontSize: 12, fontFamily: 'monospace', color: colors.textPrimary },
  badge:       { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  sectionHead: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
}
```

---

## 11. Language Priority Logic

Applied at **screening level** for cinema films, **film level** for Global Upcoming:

| Priority | Signal | Badge shown |
|----------|--------|-------------|
| 1 | `吹替` in screening type label | **JAPANESE** |
| 2 | `字幕` in screening type label | **ENGLISH** |
| 3 | Western/Hollywood title, no label | **ENGLISH** (assumed) |
| 4 | Japanese title, no label | **JAPANESE** (assumed) |
| 5 | Cannot determine | **UNKNOWN** |

A single film may have screenings with different language badges (e.g. a 10:00 Japanese screening and a 19:15 English screening). Both are shown, grouped by date, with their respective badges inline.

---

## 12. Acceptance Criteria

| # | Criterion |
|---|-----------|
| 1 | APK installs and runs on Android without error |
| 2 | Cinema screen shows Utazu tab by default |
| 3 | Each cinema tab shows now-showing films with title, poster, badge, dates, cast |
| 4 | Screening times shown per date; language badge shown per screening if mixed |
| 5 | English screenings sort above Japanese within each cinema tab |
| 6 | Coming Soon section exists per cinema tab, collapsible |
| 7 | Global Upcoming screen shows Western/Hollywood films from TMDB |
| 8 | Genre filter is multi-select, filters instantly (client-side) |
| 9 | Pull-to-refresh works on all screens |
| 10 | Weekly scrape fires automatically Monday 06:00 JST via Supabase cron |
| 11 | Edge Function failures are isolated per cinema; logged to scrape_log |
| 12 | TMDB API key stored in Supabase secrets, never in app bundle |
| 13 | Language badge uses "ENGLISH" / "JAPANESE" / "UNKNOWN" only |
| 14 | Last-scraped date visible per cinema tab |
| 15 | All colors sourced from tokens.ts; no raw hex values in components |
| 16 | Adding a new cinema requires one DB row + one adapter; no UI changes |

---

## 13. Open Questions

1. Should the app show a visible error state if the last scrape was more than 2 weeks ago (stale data warning)?
2. For the Global Upcoming section — TMDB only, or do you also want to be able to manually pin films (e.g. something not in TMDB yet)?
3. Do you want a "coming to local cinemas" indicator on Global Upcoming cards if the film appears in either cinema's upcoming list?

---

## 14. Future Considerations (v2+)

- Local push notification when a new English film is added to either cinema
- Watchlist with local storage or Supabase user table
- "Coming to local cinemas" cross-reference badge on Global Upcoming cards
- Additional cinema chain support (non-AEON)
- Manual language override via long-press on badge

---

*End of brief — v1.2*

---

## 15. Notifications (v1 — Utazu · English only)

### 15.1 Scope

Notifications fire **only for AEON Utazu**, and **only for films with at least one English-language screening**. No notifications for Ayagawa, Japanese-only films, or Global Upcoming.

Two notification types:

| Type | Trigger | Example message |
|------|---------|-----------------|
| **Now Showing** | A film newly appears in Utazu's now-showing list with an English screening | *"Mission: Impossible 8 is now showing in English at Utazu"* |
| **Upcoming** | A film newly appears in Utazu's upcoming list with an English screening | *"Upcoming in English at Utazu: The Fantastic Four"* |

"Newly appears" means the film was not present in the previous scrape run — i.e. it was added by the Monday scrape. No repeat notifications for the same film unless it disappears and reappears.

### 15.2 Implementation

**Where notifications are triggered:** inside the `scrape-cinemas` Edge Function, after the upsert step, before closing.

**Flow:**
1. After upserting Utazu films, query for films where:
   - `cinema_id = 'utazu'`
   - `status IN ('now_showing', 'upcoming')`
   - At least one screening with `language = 'english'`
   - `first_seen_at` = today (i.e. newly inserted this run — not updated)
2. For each qualifying film, send a push notification via **Expo Push API**
3. Log notification sent in `scrape_log` or a dedicated `notifications_log` table

**Schema addition — track first appearance:**
```sql
-- Add to films table
alter table films add column first_seen_at date default current_date;
```
This is set on INSERT only (not updated on subsequent upserts), so it reliably marks the scrape run when a film first appeared.

**Expo Push Notifications setup:**
- App requests push permission on first launch (Android 13+ requires explicit permission)
- Expo token stored in Supabase — a single `device_tokens` table with one row (single user)
- Edge Function reads token from that table and calls `https://exp.host/--/api/v2/push/send`
- No FCM setup required for Expo Go / development builds; production APK needs Firebase project linked via `eas build`

```sql
create table device_tokens (
  id         uuid primary key default gen_random_uuid(),
  token      text not null,
  platform   text default 'android',
  updated_at timestamptz default now()
);
```

Token is registered/updated each time the app opens (handles token rotation).

### 15.3 Notification tap → Detail screen

Tapping a notification opens the app directly to the **Film Detail screen** for that film.

**Deep link structure (Expo Router):**
```
/film/[id]          -- cinema film detail
```

Notification payload includes:
```json
{
  "title": "Now showing in English at Utazu",
  "body": "Mission: Impossible – The Final Reckoning",
  "data": {
    "screen": "/film/[film_id]"
  }
}
```

Expo Router handles the `data.screen` value on notification tap via `useNotificationResponse` hook in the root layout.

### 15.4 Film Detail Screen (`/film/[id]`)

Shown when:
- User taps a notification
- User taps a film card anywhere in the app (same screen, same component)

Content:
```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  [POSTER — full width, 2:3 ratio]   │
│  [ENGLISH badge — top right]        │
│                                     │
│  Title                              │
│  Original title (if different)      │
│  Run dates                          │
│                                     │
│  Description (full, not truncated)  │
│                                     │
│  Cast                               │
│  Name · Name · Name · Name          │
│                                     │
│  ── Screenings ──────────────────   │
│  Mon 30 Jun    10:00  13:30  19:15  │
│  Tue 01 Jul    11:00  16:00         │
│  Wed 02 Jul    10:00  19:15         │
│  ...                                │
│                                     │
│  [View on AEON website ↗]           │
└─────────────────────────────────────┘
```

- Screenings shown in full (all dates, all times)
- If film has both English and Japanese screenings, they are shown in separate groups labelled **English** / **Japanese**
- "View on AEON website" links to the cinema's main schedule page in the system browser

### 15.5 Notification behaviour rules

- **No notification if film already seen this scrape cycle** — deduplication via `first_seen_at`
- **No repeat notifications** — once a film is in the DB, it won't trigger again unless it's deleted and reappears (e.g. re-run or re-release)
- **Batch quietly** — if 3 English films appear in one scrape, send 3 separate notifications (one per film), not a grouped summary
- **Notification permission** — if user has denied permission, app shows a one-time inline banner suggesting they enable it in settings; no repeated prompting

---

*End of brief — v1.3*

---

## 16. Theme — Light & Dark Mode

### 16.1 Behaviour

- App supports **light mode** and **dark mode**
- Default: follows the system (Android system appearance setting)
- User can **override** system preference via the Settings screen (Light / Dark / System)
- Preference is persisted locally with `AsyncStorage` — survives app restarts
- Theme switches immediately on selection, no restart required

### 16.2 Token system

All colors defined in two palettes in `tokens.ts` under `colors.dark` and `colors.light`. A `useTheme()` hook returns the active palette based on the current setting. Components never reference `colors.dark` or `colors.light` directly — they always call `useTheme()`.

```ts
// tokens.ts

export const colors = {
  dark: {
    background:      '#1F1E24',
    surface:         '#2B2A33',
    surfaceElevated: '#363540',
    accent:          '#7759C2',   // GitLab Purple
    accentSubtle:    '#3D2F6B',
    textPrimary:     '#FAFAFA',
    textSecondary:   '#A8A7B3',
    textMuted:       '#6E6D7A',
    border:          '#3D3C48',
    error:           '#C24040',
    badgeEnglish:    '#2DA160',   // GitLab Green
    badgeJapanese:   '#525160',
    badgeUnknown:    'transparent',
  },
  light: {
    background:      '#FFFFFF',
    surface:         '#F5F4FA',
    surfaceElevated: '#ECEAF5',
    accent:          '#6B4FBB',   // GitLab Purple (slightly deeper for contrast on white)
    accentSubtle:    '#E8E2F7',
    textPrimary:     '#1F1E24',
    textSecondary:   '#525160',
    textMuted:       '#A8A7B3',
    border:          '#E0DFF0',
    error:           '#B03030',
    badgeEnglish:    '#2DA160',
    badgeJapanese:   '#8A8998',
    badgeUnknown:    'transparent',
  },
}
```

All values derived from the GitLab brand palette — light mode inverts the surface/text relationship while keeping accent, green badge, and purple consistent across both themes.

---

## 17. Settings Screen

### 17.1 Navigation

Bottom tab bar gains a third tab:

| Tab | Icon | Screen |
|-----|------|--------|
| 🎬 Cinemas | film icon | Cinema tabs (Utazu / Ayagawa) |
| 🌍 Global | globe icon | Global Upcoming |
| ⚙️ Settings | gear icon | Settings |

### 17.2 Settings screen layout

```
┌─────────────────────────────────────┐
│  Settings                           │
│                                     │
│  ── Appearance ──────────────────   │
│  Theme                              │
│  ○ System default                   │
│  ○ Light                            │
│  ○ Dark                             │
│                                     │
│  ── Notifications ───────────────   │
│  English films at Utazu     [  ●  ] │
│  (toggle — on by default)           │
│                                     │
│  ── About ───────────────────────   │
│  App version          1.0.0 (1)     │
│  Last scrape          Mon 23 Jun    │
│  Data source          AEON Cinema + │
│                       TMDB          │
└─────────────────────────────────────┘
```

### 17.3 App version display

- Shows **version name** + **build number** in parentheses: e.g. `1.0.0 (3)`
- Read from Expo's `expo-constants`: `Constants.expoConfig.version` + `Constants.expoConfig.android.versionCode`
- Version name and build number are set in `app.json` / `app.config.ts` and baked into the APK at build time — no runtime dependency
- This is the primary way to identify which APK build is installed during testing

```ts
// In Settings screen
import Constants from 'expo-constants'

const version = Constants.expoConfig?.version               // '1.0.0'
const build   = Constants.expoConfig?.android?.versionCode  // 3
// Displays as: "1.0.0 (3)"
```

Each `eas build` run should increment `versionCode` — a good discipline to add to the build checklist.

### 17.4 Notification toggle

- Single toggle: **"English films at Utazu"** — on by default
- When toggled off: app stops registering / renewing the push token in Supabase (Edge Function finds no token → sends nothing)
- When toggled back on: token is re-registered on next app open
- State persisted in `AsyncStorage`
- If OS-level notification permission is denied, toggle is greyed out with a note: "Enable notifications in Android Settings"

### 17.5 Last scrape

- Reads the most recent `success` row from `scrape_log` for `cinema_id = 'utazu'`
- Displayed as a human-readable date: "Mon 23 Jun"
- If no successful scrape on record: shows "Never"

---

*End of brief — v1.4*
