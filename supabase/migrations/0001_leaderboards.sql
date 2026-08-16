-- Guess The… global leaderboards
--
-- Players are anonymous Supabase auth users (Authentication → Sign In / Providers
-- → "Allow anonymous sign-ins" must be ON). That gives every player a real
-- auth.uid() without a signup flow, which is what lets the insert policy below
-- stop anyone posting a score under someone else's identity.

create table if not exists public.scores (
  id           bigint generated always as identity primary key,
  game_slug    text        not null,
  player_id    uuid        not null references auth.users (id) on delete cascade,
  handle       text        not null,
  score        integer     not null,
  rounds_won   smallint    not null default 0,
  best_streak  smallint    not null default 0,
  created_at   timestamptz not null default now(),

  -- Cheap server-side sanity limits. The client is untrusted; these bound the
  -- damage a crafted insert can do to the board.
  constraint scores_game_slug_valid check (game_slug ~ '^[a-z][a-z0-9-]{1,31}$'),
  constraint scores_handle_len      check (char_length(handle) between 1 and 20),
  constraint scores_score_range     check (score >= 0 and score <= 1000000),
  constraint scores_rounds_range    check (rounds_won  between 0 and 100),
  constraint scores_streak_range    check (best_streak between 0 and 100)
);

-- Serves the DISTINCT ON (game_slug, player_id) ... ORDER BY score DESC that
-- backs the leaderboard view, without a sort step.
create index if not exists scores_best_idx
  on public.scores (game_slug, player_id, score desc);

-- Foreign keys need their own index or cascading deletes do a seq scan.
create index if not exists scores_player_idx
  on public.scores (player_id);

alter table public.scores enable row level security;

-- Boards are public: anyone, signed in or not, can read every score.
drop policy if exists "scores are world readable" on public.scores;
create policy "scores are world readable"
  on public.scores
  for select
  to anon, authenticated
  using (true);

-- You may only post scores as yourself. `(select auth.uid())` rather than a bare
-- call so Postgres evaluates it once per statement instead of once per row.
drop policy if exists "players insert their own scores" on public.scores;
create policy "players insert their own scores"
  on public.scores
  for insert
  to authenticated
  with check ((select auth.uid()) = player_id);

-- Deliberately no UPDATE or DELETE policy: a posted score is immutable, so
-- nobody can retroactively edit their run or wipe someone else's.

-- One row per player per game — their personal best. security_invoker keeps the
-- caller's RLS in force rather than the view owner's.
drop view if exists public.leaderboard;
create view public.leaderboard
  with (security_invoker = true)
  as
select distinct on (game_slug, player_id)
  game_slug,
  player_id,
  handle,
  score,
  rounds_won,
  best_streak,
  created_at
from public.scores
order by game_slug, player_id, score desc, created_at asc;

-- What everyone has been playing lately, for the home page's "Trending" row.
drop view if exists public.trending;
create view public.trending
  with (security_invoker = true)
  as
select
  game_slug,
  count(*)::bigint as plays,
  max(created_at)  as latest
from public.scores
where created_at > now() - interval '7 days'
group by game_slug;

-- Supports the trending window scan without touching every historical row.
create index if not exists scores_recent_idx
  on public.scores (created_at desc);

-- Newly created tables are not always exposed to the Data API automatically.
grant select, insert on public.scores       to authenticated;
grant select          on public.scores      to anon;
grant select          on public.leaderboard to anon, authenticated;
grant select          on public.trending    to anon, authenticated;
