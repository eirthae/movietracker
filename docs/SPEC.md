# Cinema Tracker — Spec (v2, web)

**Status:** current · **Last updated:** 2026-07-14
**Design source of truth:** `Cinema Tracker Mockups.dc.html` in the Claude
Design project (claude.ai/design, project `fe3b54ba-…`). When this document and
the design disagree, the design wins.

## 1. What it is

A personal, mobile-first **web app** that tracks what's playing at AEON
cinemas in Japan and answers one question fast: **"can I watch this in
English, and when?"** Backed by Supabase (Postgres + Edge Functions); data
refreshes automatically every week.

## 2. Core features (the base scope)

1. **Weekly movie data** from every added cinema — films, info, poster,
   run dates. Supported chains: **AEON**, **TOHO Cinemas**, **Parks
   Cinema / SMT** (one adapter each; see docs/DATA.md).
2. **Screening times** per film, per date, with **ENG (字幕/SUB) vs
   日本語 (吹替/DUB or domestic)** detected per screening.
3. **Add a screening to Google Calendar** — pick a date + time on the film
   card; the button appears right there and opens Google Calendar pre-filled
   (JST time, real runtime, cinema as location). URL template; no OAuth.
   A **one-time privacy prompt** on first use explains that nothing is
   connected, seen, stored, or shared (see §6 Privacy).
4. **Add new cinemas by URL** — paste a supported schedule link, the app
   validates it, previews the film count, and starts tracking immediately.
   **Cinema lists are per device** (friends each pick their own tabs); the
   film data itself is shared and scraped once per cinema.

## 3. Screens (per the design)

| Screen | Route | Notes |
|---|---|---|
| Cinemas | `/` | **Ships empty**: first run shows a big centred ＋ button — "Add a cinema to get movies", no heading. Once a cinema is added: one top tab per cinema (+ add button). "Updated Mon 23 Jun" under each tab from the scrape log. **Now Showing**: full cards with poster, ENG/日本語 badge, titles, dates·genres, and an inline screenings picker (date chips → time chips with per-time language tags). **Picking a time reveals the Add to Google Calendar button inside the card** with the selection caption (`Sat 28 Jun · 19:15 · Harbor of Kites (ENG)`). **Coming Soon**: collapsible, compact cards. There is no per-film detail page. |
| Settings | `/settings` | Appearance (System/Light/Dark radios, persisted), Notifications toggle ("English films"), About (app version, last scrape, data source). |
| Add Cinema | `/add` | Name, schedule URL (AEON / TOHO / Parks), auto-generated short ID (`utazu`, `toho-032`, `parks-namba`), validation preview card ("URL looks valid — found 9 films" / "Already tracked — ready right away"), Add button. |

Bottom tab bar (Cinemas · Settings) on the two main screens only.

## 4. Language rules

Detected per screening from the AEON title prefix:

| Signal | Language | Badge |
|---|---|---|
| `字幕` / `SUB` prefix | English (subtitled, original audio) | **ENG** (green) |
| `吹替` / `DUB` prefix | Japanese (dubbed) | **日本** (grey) |
| no prefix | Japanese domestic release | **日本** |

A film's card badge is **ENG if any screening is English**. English films sort
above Japanese-only films. One film can show mixed ENG/日本 times on the same
date — they render as separate time chips with their own tags.

## 5. Architecture

```
Web app (Vite + React + TS)  ──reads──►  Supabase Postgres  ◄──writes──  Edge Functions
  4 screens, React Query                  cinemas, films,               scrape-cinemas (weekly cron)
  mock mode without .env                  screenings, scrape_log       manage-cinema  (validate/add/delete)
        │                                                                    │ fetch JSON
        ▼                                                                    ▼
  Google Calendar URL template                              theater.aeoncinema.com
  (add screening as event)                                  /schedule/v2/data/{slug}/…
```

- Reads use the client-safe publishable key; RLS makes all tables read-only
  for it. All writes happen in Edge Functions with the service-role key.
- Weekly cron: `0 21 * * 0` UTC = Monday 06:00 JST.
- Theming: GitLab brand palette as CSS variables (see `src/styles/tokens.css`),
  dark + light, system-following by default.

## 6. Privacy (the app is meant to be shared with friends)

- **No accounts, no login, no personal data server-side.** The database holds
  cinema schedules only.
- **Google Calendar is never "connected".** The button opens Google's event
  template URL in the user's own browser session; they save the event
  themselves. No OAuth, no tokens, no calendar access, nothing stored — the
  only data sent to Google is the event text (film, time, cinema).
- All preferences (theme, notification toggle, calendar consent) live in the
  browser's localStorage on the device — never uploaded.

## 7. Out of scope (for now)

- Notification **delivery** (the Settings toggle stores the preference; web
  push needs a service worker + VAPID keys — future work).
- TMDB enrichment (descriptions/genres/cast for real scraped films — AEON's
  API doesn't provide them; see docs/DATA.md).
- Deleting cinemas from the UI (the Edge Function supports `delete`; no UI per
  the design).
- Accounts/auth — single user, no login.

## 8. History

v1 was an Expo/React Native Android APK with Expo push notifications (spec:
`cinema-tracker-brief.md`, removed; both preserved in git history at
`26b183a`). v2 supersedes it: same job, web delivery, calendar export instead
of push-first, and a cleaner per-screening language model.
