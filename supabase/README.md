# Revenue Agent Hub — Backend Setup

What you're setting up: a **Supabase** project (free tier is plenty to start)
that gives you a real Postgres database + auth + two serverless Edge
Functions that call the AI/job-feed APIs. Your Netlify frontend deploy
doesn't change — it just starts talking to a real backend instead of
in-memory mock data.

## 1. Create the Supabase project

1. Go to supabase.com → New project. Pick the free tier, any region close to
   your users.
2. Once it's provisioned, go to **Project Settings → API**. Copy:
   - `Project URL` → this is `VITE_SUPABASE_URL`
   - `anon public` key → this is `VITE_SUPABASE_ANON_KEY`
3. In **Authentication → Providers**, make sure **Anonymous sign-ins** is
   enabled (this app uses one anonymous account per browser/device so you get
   real per-user data isolation without building a login screen yet — you can
   swap this for real email/password auth later with no schema changes).

## 2. Run the database schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste the contents of `supabase/migrations/0001_init.sql` and run it.
   This creates the `leads`, `articles`, `widgets`, `execution_logs`, and
   `user_settings` tables, all with Row Level Security so each user only ever
   sees their own rows.

(If you install the Supabase CLI later, `supabase db push` does the same
thing from your terminal.)

## 3. Deploy the two Edge Functions

Install the CLI once: `npm install -g supabase`

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF   # find this in your project URL
supabase functions deploy generate-content
supabase functions deploy scan-leads
```

## 4. Set the real API keys as backend secrets (never in the frontend)

```bash
# Powers real SEO article generation (Content Engine agent)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# Powers live lead scraping (Lead Finder agent) — optional, has a demo fallback
supabase secrets set RAPIDAPI_KEY=your-rapidapi-key
supabase secrets set RAPIDAPI_HOST=your-chosen-rapidapi-host
```

Get an Anthropic key at console.anthropic.com. For leads, browse rapidapi.com
for a job-search API you like (search "freelance jobs" or "Upwork"), then
open `supabase/functions/scan-leads/index.ts` and adjust `mapExternalJob()`
to match that provider's exact response fields — every job API names things
slightly differently, so this one spot needs a manual tweak once you've
picked a provider. Until then, the function returns clearly-labeled demo
leads instead of failing.

## 5. Wire the frontend

Add these two lines to Netlify → Site settings → Environment variables (and
to a local `.env` file if you run `npm run dev`):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then `npm install` (to pull in `@supabase/supabase-js`) and redeploy. On
first load, the app signs in anonymously, seeds your empty tables with the
starter demo rows, and from then on every lead/article/widget/log you create
persists across refreshes and devices signed into the same session.

## What this buys you right now

- **Real persistence** — refreshing the page no longer wipes your data.
- **Real SEO content** — once `ANTHROPIC_API_KEY` is set, the Content Engine
  writes real, unique articles instead of templated text.
- **A clean seam for real lead data** — the scraping function is live and
  deployed; it just needs your chosen job-feed provider's key and a 10-line
  field-mapping tweak.
- **No cost until you add keys** — Supabase's free tier covers DB + auth +
  function invocations at this scale, and both agent functions fall back to
  labeled demo output if a key isn't set, so nothing breaks or bills you
  unexpectedly while you're still in the freelancing/bootstrapping phase.

## Later, when you have paying clients

- Swap anonymous auth for real email/password or magic-link auth (Supabase
  Auth supports this natively — the RLS policies already key everything off
  `auth.uid()`, so no schema changes needed).
- Add a `stripe` webhook Edge Function to flip `widgets.status` and record
  real MRR when a client subscribes.
- Consider Supabase Pro ($25/mo) once you're past the free tier's row/
  bandwidth limits — a good problem to have.
