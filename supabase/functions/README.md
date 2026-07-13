# Edge Functions

Two functions, both written for the Deno edge runtime and deployed with the
Supabase CLI. Shared code lives in `_shared/`.

| Function | Trigger | What it does |
|---|---|---|
| `scrape-cinemas` | Weekly cron + manual invoke | Pulls every cinema's schedule from AEON's JSON API, upserts films/screenings, logs to `scrape_log` |
| `manage-cinema` | Called from the web app | `validate` (Add Cinema preview), `add` (insert + immediate scrape), `delete` |

## Deploy

```bash
npx supabase functions deploy scrape-cinemas
npx supabase functions deploy manage-cinema
npx supabase functions invoke scrape-cinemas --no-verify-jwt   # first data pull
```

Both functions run with the project's built-in `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` env vars — no extra secrets needed.

## Weekly cron

Dashboard → Integrations → **Cron** → new job:

- Schedule: `0 21 * * 0` (Sunday 21:00 UTC = **Monday 06:00 JST**)
- Type: Edge Function → `scrape-cinemas`

AEON publishes the coming week's schedule ahead of the Monday cinema-week
start, so a Monday-morning scrape captures the fresh week.

## Data source notes

See [docs/DATA.md](../../docs/DATA.md) for the AEON endpoints, the language
detection rules, and what data is (and isn't) available.
