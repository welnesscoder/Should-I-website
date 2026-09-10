-- Should I? — V2 database schema (Supabase / Postgres)
-- Run this against a Supabase project. Decisions themselves stay as code
-- config (see /content/decisions) — this `decisions` table exists only so
-- votes/runs have a stable foreign key and future admin tooling has
-- somewhere to read from; it is not the source of truth for decision copy.

create extension if not exists "pgcrypto";

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  title text not null,
  teaser text,
  engine_type text not null,
  risk_level text not null default 'standard',
  is_published boolean not null default true,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  decision_id text not null, -- matches the code-config decision id (e.g. "should-i-buy-it")
  choice text not null check (choice in ('yes', 'no')),
  voter_fingerprint text not null, -- hashed anonymous identifier, never a raw IP
  created_at timestamptz not null default now(),
  unique (decision_id, voter_fingerprint)
);

create index if not exists votes_decision_id_created_at_idx on votes (decision_id, created_at desc);

create table if not exists decision_runs (
  -- Analytics only. Never store raw financial inputs here — score, verdict,
  -- engine, and decision id only.
  id uuid primary key default gen_random_uuid(),
  decision_id text not null,
  session_id text,
  score int not null check (score between 0 and 100),
  verdict text not null,
  created_at timestamptz not null default now()
);

create table if not exists daily_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  date date unique not null,
  created_at timestamptz not null default now()
);

create table if not exists daily_question_votes (
  id uuid primary key default gen_random_uuid(),
  daily_question_id uuid not null references daily_questions (id) on delete cascade,
  choice text not null check (choice in ('yes', 'no')),
  voter_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (daily_question_id, voter_fingerprint)
);

-- Atomic insert-and-return-counts, called from a Route Handler with the
-- service role key. ON CONFLICT DO NOTHING makes repeat votes from the same
-- fingerprint a no-op rather than an error (soft anonymous dedup).
create or replace function cast_vote(p_decision_id text, p_choice text, p_fingerprint text)
returns table (yes_count bigint, no_count bigint)
language plpgsql
security definer
as $$
begin
  insert into votes (decision_id, choice, voter_fingerprint)
  values (p_decision_id, p_choice, p_fingerprint)
  on conflict (decision_id, voter_fingerprint) do nothing;

  return query
    select
      count(*) filter (where choice = 'yes') as yes_count,
      count(*) filter (where choice = 'no') as no_count
    from votes
    where decision_id = p_decision_id;
end;
$$;

create or replace function cast_daily_question_vote(p_daily_question_id uuid, p_choice text, p_fingerprint text)
returns table (yes_count bigint, no_count bigint)
language plpgsql
security definer
as $$
begin
  insert into daily_question_votes (daily_question_id, choice, voter_fingerprint)
  values (p_daily_question_id, p_choice, p_fingerprint)
  on conflict (daily_question_id, voter_fingerprint) do nothing;

  return query
    select
      count(*) filter (where choice = 'yes') as yes_count,
      count(*) filter (where choice = 'no') as no_count
    from daily_question_votes
    where daily_question_id = p_daily_question_id;
end;
$$;

-- Row Level Security: reads are open (vote counts are public), writes only
-- via the RPC functions above (called with the service role key from a
-- Route Handler, which bypasses RLS entirely — these policies are the
-- fallback if the anon key is ever used directly against these tables).
alter table votes enable row level security;
alter table daily_question_votes enable row level security;
alter table decision_runs enable row level security;

create policy "votes are publicly readable" on votes for select using (true);
create policy "daily question votes are publicly readable" on daily_question_votes for select using (true);

-- SayLess social content (Am I Cooked?, Who's Wrong?, Is This Normal?,
-- Worth the Hype?, Quick Fire). All five formats are structurally the same
-- — a prompt with a binary vote — so they share ONE generic votes table and
-- ONE RPC instead of a table+RPC per format. `content_type` + `content_id`
-- match the `type` and `id` of the corresponding entry in /content/social,
-- the same "code config is the source of truth, DB only holds votes"
-- pattern the `votes` table above already uses for decisions. Adding a
-- sixth social format later needs zero schema changes.
create table if not exists content_votes (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id text not null,
  option_key text not null,
  voter_fingerprint text not null, -- hashed anonymous identifier, never a raw IP
  created_at timestamptz not null default now(),
  unique (content_type, content_id, voter_fingerprint)
);

create index if not exists content_votes_lookup_idx on content_votes (content_type, content_id, created_at desc);

create or replace function cast_content_vote(
  p_content_type text,
  p_content_id text,
  p_option_key text,
  p_fingerprint text
)
returns table (option_key text, vote_count bigint)
language plpgsql
security definer
as $$
begin
  insert into content_votes (content_type, content_id, option_key, voter_fingerprint)
  values (p_content_type, p_content_id, p_option_key, p_fingerprint)
  on conflict (content_type, content_id, voter_fingerprint) do nothing;

  return query
    select cv.option_key, count(*)
    from content_votes cv
    where cv.content_type = p_content_type and cv.content_id = p_content_id
    group by cv.option_key;
end;
$$;

alter table content_votes enable row level security;
create policy "content votes are publicly readable" on content_votes for select using (true);
