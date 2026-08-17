-- Game suggestions from the footer form.
--
-- Write-only by design: anyone may post an idea, nobody may read them back.
-- There is an INSERT policy and deliberately no SELECT, UPDATE or DELETE
-- policy, so with RLS on, every read is refused at the database. The only way
-- to see suggestions is the Supabase dashboard, which bypasses RLS as the
-- table owner. That matters because a public SELECT would turn this into a
-- free-form message board anyone could read.

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  idea text not null,
  -- Optional, so someone can be told their idea got built.
  contact text,
  -- Whoever was signed in, anonymous session included. Null when Supabase auth
  -- was unavailable; the suggestion is still worth keeping.
  player_id uuid
);

-- Reading is done in the dashboard, newest first.
create index if not exists suggestions_created_at_idx
  on public.suggestions (created_at desc);

alter table public.suggestions enable row level security;

-- Length bounds live in the policy rather than a CHECK constraint so that a
-- junk submission is rejected as a policy violation instead of a constraint
-- error leaking the table shape.
drop policy if exists "anyone can suggest" on public.suggestions;
create policy "anyone can suggest"
  on public.suggestions
  for insert
  to anon, authenticated
  with check (
    length(btrim(idea)) between 3 and 1000
    and (contact is null or length(contact) <= 200)
  );

-- RLS decides which rows; the grant decides whether the Data API exposes the
-- table at all. Insert only — no select grant, matching the policies above.
grant insert on public.suggestions to anon, authenticated;
