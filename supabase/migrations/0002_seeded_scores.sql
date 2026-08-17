-- Support for seeded ("house") scores on an otherwise empty leaderboard.
--
-- Two changes are needed:
--
--  1. `player_id` referenced auth.users, so a seeded row would have required a
--     real auth account per fake player. The foreign key is dropped; what
--     actually protects the table is the RLS policy below, which still ties
--     every client-side insert to the caller's own auth.uid().
--
--     Trade-off: deleting an auth user no longer cascades away their scores.
--     That is deliberate — a leaderboard that silently loses rows when someone
--     clears their account is worse than a few orphans.
--
--  2. A `bot` flag, so seeded rows can be told apart from real ones later:
--     filtered out of stats, labelled in the UI, or deleted in one statement.

alter table public.scores
  drop constraint if exists scores_player_id_fkey;

alter table public.scores
  add column if not exists bot boolean not null default false;

-- Clients must not be able to pass their own rows off as seeded ones, or to
-- write under another player's id. Both are enforced here rather than trusted
-- to the app.
drop policy if exists "players insert their own scores" on public.scores;
create policy "players insert their own scores"
  on public.scores
  for insert
  to authenticated
  with check ((select auth.uid()) = player_id and bot = false);

-- Lets "real scores only" queries skip the seeded rows cheaply.
create index if not exists scores_bot_idx
  on public.scores (game_slug, bot, score desc);

-- The leaderboard view keeps one row per player per game. Seeded players carry
-- distinct random uuids, so they rank individually rather than collapsing.
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
  bot,
  created_at
from public.scores
order by game_slug, player_id, score desc, created_at asc;

grant select on public.leaderboard to anon, authenticated;

-- To remove every seeded score later:
--   delete from public.scores where bot;
