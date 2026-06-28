# Edge Functions

Two Deno functions back the app. Both use the **service-role key** (auto-injected
as `SUPABASE_SERVICE_ROLE_KEY`) and bypass RLS.

| Function | Trigger | Purpose |
|---|---|---|
| `scrape-cinemas` | Weekly cron + manual | Fetch AEON JSON for every cinema → upsert films/screenings → log → push notifications for new English films at Utazu |
| `manage-cinema` | App (`functions.invoke`) | Add a cinema by URL (validate + name lookup + immediate scrape) or delete one |

Shared logic lives in `_shared/`:
- `aeon.ts` — fetch + parse AEON's JSON schedule/movies API (no HTML scraping)
- `persist.ts` — upsert films, refresh screenings, detect new English films
- `push.ts` — Expo Push API client

## Deploy

```bash
npx supabase functions deploy scrape-cinemas
npx supabase functions deploy manage-cinema
```

(`verify_jwt = false` is set per-function in `config.toml`, so the app can invoke
`manage-cinema` with the publishable key.)

## Test / run on demand

```bash
# Manual scrape (all cinemas)
npx supabase functions invoke scrape-cinemas --no-verify-jwt

# Add a cinema
npx supabase functions invoke manage-cinema --no-verify-jwt \
  --body '{"action":"add","url":"https://cinema.aeoncinema.com/wm/utazu/"}'
```

Or from the Supabase Dashboard → Edge Functions → Invoke.

## Weekly cron — Monday 06:00 JST (= 21:00 UTC Sunday)

Easiest: **Dashboard → Integrations → Cron → Create job**, schedule `0 21 * * 0`,
type "Supabase Edge Function", pick `scrape-cinemas`.

Or via SQL (run once in the SQL Editor — needs `pg_cron` + `pg_net`, and your
service-role key; do **not** commit this with the key filled in):

```sql
select cron.schedule(
  'weekly-cinema-scrape',
  '0 21 * * 0',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.functions.supabase.co/scrape-cinemas',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    )
  );
  $$
);
```

## Notifications

No extra secrets needed — the function reads device tokens from `device_tokens`
and calls Expo's push API directly. For a **production APK**, Expo needs an FCM
(Firebase) credential configured via `eas` (see the app's build docs).
