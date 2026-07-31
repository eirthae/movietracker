# Edge Functions

Two functions, both written for the Deno edge runtime and deployed with the
Supabase CLI. Shared code lives in `_shared/`.

| Function | Trigger | What it does |
|---|---|---|
| `scrape-cinemas` | Daily cron + manual invoke | Pulls every cinema's schedule via its chain adapter (AEON/TOHO/Parks), upserts films/screenings, logs to `scrape_log` |
| `manage-cinema` | Called from the web app | `validate` (Add Cinema preview), `add` (insert + immediate scrape), `delete` |

## Deploy

```bash
npx supabase functions deploy scrape-cinemas
npx supabase functions deploy manage-cinema
npx supabase functions invoke scrape-cinemas --no-verify-jwt   # first data pull
```

Both functions run with the project's built-in `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` env vars — no extra secrets needed.

## Daily cron

Scheduled **inside the database** by migration
`20260731000000_daily_scrape_cron.sql` (pg_cron + pg_net): `0 21 * * *` UTC =
**06:00 JST every day** — nothing to configure in the dashboard. Daily rather
than weekly so a transient bot-protection block (AEON 403'd the Jul 27 run)
self-heals within a day; the shared fetch helpers also retry 403/429/5xx.

## Data source notes

See [docs/DATA.md](../../docs/DATA.md) for the AEON endpoints, the language
detection rules, and what data is (and isn't) available.
