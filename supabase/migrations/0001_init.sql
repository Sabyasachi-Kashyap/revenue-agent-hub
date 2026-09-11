-- Revenue Agent Hub — initial schema
-- Run this in Supabase SQL Editor, or via `supabase db push`

create extension if not exists "uuid-ossp";

-- ========== LEADS ==========
create table if not exists leads (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  source text not null,
  category text not null,
  budget numeric not null,
  est_days integer not null,
  match_score integer not null,
  description text not null,
  skills_required text[] not null default '{}',
  status text not null default 'new',
  client_name text,
  client_location text,
  posted_time text,
  proposal jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== CONTENT ARTICLES ==========
create table if not exists articles (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  topic text not null,
  niche text not null,
  keyword text not null,
  est_monthly_search_volume integer not null default 0,
  monetization_type text not null,
  status text not null default 'drafting',
  title text not null,
  outline text[] not null default '{}',
  content_body text,
  suggested_affiliate_products jsonb not null default '[]',
  social_snippets jsonb not null default '[]',
  est_monthly_revenue numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== CLIENT WIDGETS ==========
create table if not exists widgets (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  client_name text not null,
  business_niche text not null,
  primary_color text not null default '#10b981',
  bot_avatar_url text,
  welcome_message text not null,
  auto_lead_qualification_questions text[] not null default '{}',
  monthly_subscription_price numeric not null default 99,
  active_leads_captured integer not null default 0,
  monthly_recurring_revenue numeric not null default 0,
  embed_script_code text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== EXECUTION LOGS ==========
create table if not exists execution_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  timestamp text not null,
  agent_name text not null,
  level text not null,
  message text not null,
  details text,
  created_at timestamptz not null default now()
);

-- ========== USER SETTINGS (non-secret prefs only — API keys never live here) ==========
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  auto_pilot_enabled boolean not null default true,
  min_lead_budget numeric not null default 500,
  min_match_score integer not null default 80,
  bank_details jsonb,
  updated_at timestamptz not null default now()
);

-- ========== ROW LEVEL SECURITY ==========
alter table leads enable row level security;
alter table articles enable row level security;
alter table widgets enable row level security;
alter table execution_logs enable row level security;
alter table user_settings enable row level security;

-- Each user can only see/edit their own rows
create policy "own leads" on leads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own articles" on articles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own widgets" on widgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own logs" on execution_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists idx_leads_user on leads(user_id);
create index if not exists idx_articles_user on articles(user_id);
create index if not exists idx_widgets_user on widgets(user_id);
create index if not exists idx_logs_user_created on execution_logs(user_id, created_at desc);
