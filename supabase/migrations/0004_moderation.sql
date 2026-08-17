-- Moderation: taking bad content out of circulation.
--
-- Some rounds are simply not fit to deal. A Wikipedia page image that is a
-- placeholder rather than the animal, an iTunes preview that is thirty seconds
-- of silence, a quote attributed to the wrong person, a rebus that is unfair or
-- offensive. A moderator playing the game is the person best placed to spot
-- those, and this is what lets them retire one on the spot: the round's stable
-- id goes into `hidden_items`, and every client filters its deck against that
-- list before dealing. The item is never handed to anyone again.
--
--
-- ── HOW THE OWNER BECOMES A MODERATOR ──────────────────────────────────────
--
-- Run this file in the Supabase dashboard → SQL Editor. That is all. It seeds
-- kilanrou@gmail.com as the only moderator.
--
-- Then sign in on the site with Google, using that same Google account. The
-- moderator controls appear by themselves on the reveal screen. There is no
-- user id to look up and paste any more — moderators are keyed on the verified
-- email address in the JWT, so the account *is* the credential.
--
-- To add another moderator later, insert their address in lowercase:
--
--     insert into public.moderators (email, note)
--     values ('someone@example.com', 'why they have this')
--     on conflict (email) do nothing;
--
-- To remove one:
--
--     delete from public.moderators where email = 'someone@example.com';
--
-- (If you ever do need to match a row back to a person's account:
--  `select id, email from auth.users;` — but nothing here requires it.)
--
--
-- ── WHY THE EMAIL CLAIM, AND WHICH ONE ─────────────────────────────────────
--
-- Authorization reads `auth.jwt() ->> 'email'`. That is a TOP-LEVEL claim,
-- populated by GoTrue from `auth.users.email`, which is set by the identity
-- provider at sign-in. The end user cannot write to it.
--
-- It is deliberately NOT `auth.jwt() -> 'user_metadata' ->> 'email'`. That one
-- is user-editable — any client can call `updateUser({ data: { email: ... } })`
-- and set it to anything at all, so a policy trusting it would let literally
-- anyone make themselves a moderator. Supabase's own database linter flags this
-- as an ERROR (0015_rls_references_user_metadata). Do not "simplify" the
-- policies below into reading user_metadata.
--
-- Anonymous sign-ins are enabled on this project (the leaderboard writes depend
-- on them), so most sessions are anonymous users with no email claim at all.
-- For them `auth.jwt() ->> 'email'` is null or '', `nullif(...)` turns '' into
-- null, and `m.email = null` is null — never true. An anonymous player is
-- therefore never a moderator, and the check fails closed rather than erroring.
--
-- One thing to keep an eye on: the email claim says which address the account
-- carries, not which provider vouched for it. Keep "Confirm email" ON under
-- Authentication → Providers → Email (it is on by default). Otherwise someone
-- could register kilanrou@gmail.com with a password they chose and inherit the
-- claim. With confirmation on, they would need the real inbox.
--
-- If you want to go further and require the Google identity specifically, add
-- this to each moderator check below. `app_metadata` is admin-controlled and
-- not user-editable, so it is safe to trust — but it will lock out any sign-in
-- method other than Google, so it is left off by default:
--
--     and (select auth.jwt() -> 'app_metadata' ->> 'provider') = 'google'


-- ── moderators ─────────────────────────────────────────────────────────────

create table if not exists public.moderators (
  -- Lowercase, always. The claim is lowercased on the way in too, so a Google
  -- account spelled Kilanrou@Gmail.com still matches.
  email      text primary key,
  note       text,
  created_at timestamptz not null default now(),

  constraint moderators_email_is_lower check (email = lower(email)),
  constraint moderators_email_shape    check (email like '%_@_%')
);

alter table public.moderators enable row level security;

-- A client needs exactly one answer from this table: "am I a moderator?" It
-- gets that by selecting and seeing whether a row comes back — and the policy
-- means the only row it can ever see is its own. The full moderator list is not
-- readable by players, or by other moderators.
drop policy if exists "moderators see only themselves" on public.moderators;
create policy "moderators see only themselves"
  on public.moderators
  for select
  to authenticated
  using (email = lower(nullif((select auth.jwt() ->> 'email'), '')));

-- Deliberately no INSERT, UPDATE or DELETE policy. With RLS on, that means no
-- client can ever change who the moderators are, whatever it sends. The list is
-- edited in the dashboard, which runs as the table owner and bypasses RLS.

insert into public.moderators (email, note)
values ('kilanrou@gmail.com', 'site owner')
on conflict (email) do nothing;


-- ── hidden_items ───────────────────────────────────────────────────────────

create table if not exists public.hidden_items (
  id         uuid primary key default gen_random_uuid(),
  -- Which game the item belongs to, e.g. 'song', 'country', 'rebus'.
  game_slug  text not null,
  -- The round's stable id, e.g. 'song:bohemian rhapsody|queen', 'dish:Paella',
  -- 'country:Japan:35.689'. Built by the game itself and stable across builds,
  -- which is the whole reason it can be used as a hide key.
  item_id    text not null,
  -- Free text from the moderator: "image is a placeholder", "preview silent".
  reason     text,
  -- Audit trail. Not a foreign key to auth.users: if the account is ever
  -- deleted the hide must survive, otherwise bad content quietly comes back.
  hidden_by  uuid,
  created_at timestamptz not null default now(),

  -- Hiding something twice is not an error worth surfacing, and this is what
  -- makes the second attempt a no-op the client can ignore.
  unique (game_slug, item_id)
);

-- Clients fetch the hide-list and filter their deck against it, so lookups are
-- by game. The unique constraint above already indexes (game_slug, item_id) and
-- can serve a game_slug-only lookup on its own; this index is here because a
-- game_slug scan is the one access path that matters and it should not depend
-- on the shape of a constraint that might later change. The table holds tens of
-- rows, so the extra write cost is nil. Drop it if you prefer to lean on the
-- constraint's index.
create index if not exists hidden_items_game_idx
  on public.hidden_items (game_slug);

alter table public.hidden_items enable row level security;

-- Every client must be able to read the whole hide-list, signed in or not —
-- filtering the deck is the entire point, and a signed-out player has to get
-- the same filtered deck as everyone else. There is nothing sensitive in here:
-- it is a list of content that is no longer shown.
drop policy if exists "hide-list is world readable" on public.hidden_items;
create policy "hide-list is world readable"
  on public.hidden_items
  for select
  to anon, authenticated
  using (true);

-- Only a moderator may hide something, and only under their own id.
--
-- Two independent conditions, both required. `hidden_by` keeps the audit column
-- honest — you cannot log a hide as somebody else. The `exists` is the actual
-- authorization: the caller's verified email must appear in `moderators`.
--
-- `(select auth.uid())` / `(select auth.jwt())` rather than bare calls so
-- Postgres evaluates each once per statement instead of once per row.
--
-- Note this leans on `moderators` being readable to its owner: the subquery
-- runs as `authenticated`, so the moderators SELECT policy applies to it, and
-- the row it looks for is exactly the row that policy exposes. That is also why
-- the grant below matters — without SELECT on moderators the subquery would
-- fail on privileges rather than return false.
drop policy if exists "moderators hide items" on public.hidden_items;
create policy "moderators hide items"
  on public.hidden_items
  for insert
  to authenticated
  with check (
    (select auth.uid()) = hidden_by
    and exists (
      select 1
      from public.moderators m
      where m.email = lower(nullif((select auth.jwt() ->> 'email'), ''))
    )
  );

-- Undo. Hiding is one click during a game, so it will occasionally be a
-- misclick; without this the only fix would be a trip to the dashboard.
drop policy if exists "moderators unhide items" on public.hidden_items;
create policy "moderators unhide items"
  on public.hidden_items
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.moderators m
      where m.email = lower(nullif((select auth.jwt() ->> 'email'), ''))
    )
  );

-- No UPDATE policy: a hide is a fact, not something to edit. Change one by
-- deleting it and hiding again with a better reason.

-- RLS decides which rows; the grants decide whether the Data API exposes the
-- table at all. These mirror the policies exactly.
--
-- `authenticated` needs SELECT on moderators for its own "am I a moderator?"
-- check and for the subqueries above. `anon` gets nothing on moderators — a
-- signed-out visitor has no email claim, so the table could tell it nothing
-- anyway, and not granting it keeps the table off the anonymous API surface.
grant select                 on public.moderators   to authenticated;
grant select                 on public.hidden_items to anon, authenticated;
grant insert, delete         on public.hidden_items to authenticated;
