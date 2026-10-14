# The Debt — Broker Ledger

Production: https://<project_name>.vercel.app
<!-- TODO(you): replace with the real Vercel URL before Monday freeze, e.g. https://the-debt.vercel.app -->

## What it is

Secure multi-tenant ledger for brokers managing **clients** (debtors) and **markers** (IOUs/favors linked by `markers.client_id -> clients.id`). Charts answer: (1) "Is our leverage growing?" (2) "Where is our power concentrated?"

## Demo login

- Operator A (primary demo): `demo@clinic.example` / ask owner for password
- Operator B (RLS proof): `demo2@clinic.example` / ask owner for password
<!-- TODO(you): replace with real demo accounts. Never commit passwords. -->

## Run steps

```bash
pnpm install
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (names only, never values)
pnpm dev                     # http://localhost:3000
```

Apply DB policy: run `supabase/migrations/001_debt_rls.sql` in Supabase SQL Editor.

## Env vars (names only)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (fallback: `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `POSTGRES_URL` (server-only)

## Smoke checks (tick on production, today, as the right user)

- [ ] 1. Production URL loads signed out (`/login`) and signed in (`/dashboard`)
- [ ] 2. README has live link, demo login, run steps (this file)
- [ ] 3. Signed out, `/dashboard` redirects to `/login`
- [ ] 4. Clients CRUD: create "Seed patient 1", rename it, delete it; list updates
- [ ] 5. Markers CRUD via FK dropdown showing only your active clients
- [ ] 6. RLS: user two sees empty lists; user-one edit URL 404s; cross-insert = 42501
- [ ] 7. Chart 1 "Is our leverage growing?" — axes labelled, bars from zero + decision line
- [ ] 8. Chart 2 "Where is our power concentrated?" — donut with name + count labels
- [ ] 9. `PROPOSAL.md` in repo with audience + two chart questions
- [ ] 10. `git ls-files | grep env` shows only `.env.example`; latest Vercel deploy Ready

## Wednesday extras

- [ ] 60–90s backup recording of happy path linked in `DEMO.md`
- [ ] `DEMO.md` is 5 lines (hook, problem, walk, decision, limits)
