create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.normalize_admin_user_email()
returns trigger
language plpgsql
as $$
begin
  new.email = lower(trim(new.email));
  return new;
end;
$$;

drop trigger if exists admin_users_normalize_email on public.admin_users;

create trigger admin_users_normalize_email
before insert or update on public.admin_users
for each row
execute function public.normalize_admin_user_email();

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );
$$;

grant execute on function public.is_admin() to authenticated;

create table if not exists public.lesson_assets (
  slice_key text primary key,
  assets jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_lesson_assets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists lesson_assets_set_updated_at on public.lesson_assets;

create trigger lesson_assets_set_updated_at
before update on public.lesson_assets
for each row
execute function public.set_lesson_assets_updated_at();

create table if not exists public.lesson_settings (
  slice_key text primary key,
  game_status text not null default 'none',
  updated_at timestamptz not null default timezone('utc', now()),
  constraint lesson_settings_game_status_check
    check (game_status in ('none', 'coming_soon', 'available'))
);

create or replace function public.set_lesson_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists lesson_settings_set_updated_at on public.lesson_settings;

create trigger lesson_settings_set_updated_at
before update on public.lesson_settings
for each row
execute function public.set_lesson_settings_updated_at();

create table if not exists public.lesson_availability (
  slice_key text primary key,
  asset_count integer not null default 0,
  game_status text not null default 'none',
  status text not null default 'empty',
  updated_at timestamptz not null default timezone('utc', now()),
  constraint lesson_availability_status_check
    check (status in ('empty', 'partial', 'live')),
  constraint lesson_availability_game_status_check
    check (game_status in ('none', 'coming_soon', 'available'))
);

alter table public.lesson_availability
add column if not exists game_status text not null default 'none';

alter table public.lesson_availability
drop constraint if exists lesson_availability_game_status_check;

alter table public.lesson_availability
add constraint lesson_availability_game_status_check
check (game_status in ('none', 'coming_soon', 'available'));

create or replace function public.count_uploaded_assets(p_assets jsonb)
returns integer
language sql
immutable
as $$
  select count(*)::integer
  from jsonb_each(coalesce(p_assets, '{}'::jsonb)) as item(key, value)
  where coalesce(value ->> 'path', '') <> ''
    and coalesce(value ->> 'name', '') <> '';
$$;

create or replace function public.has_uploaded_asset(
  p_assets jsonb,
  p_asset_key text
)
returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from jsonb_each(coalesce(p_assets, '{}'::jsonb)) as item(key, value)
    where item.key = p_asset_key
      and coalesce(value ->> 'path', '') <> ''
      and coalesce(value ->> 'name', '') <> ''
  );
$$;

create or replace function public.count_uploaded_core_assets(p_assets jsonb)
returns integer
language sql
immutable
as $$
  select count(*)::integer
  from jsonb_each(coalesce(p_assets, '{}'::jsonb)) as item(key, value)
  where item.key in ('ppt', 'lp', 'worksheet')
    and coalesce(value ->> 'path', '') <> ''
    and coalesce(value ->> 'name', '') <> '';
$$;

create or replace function public.sync_lesson_availability(
  p_slice_key text,
  p_assets jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_asset_count integer := public.count_uploaded_assets(p_assets);
  v_game_status text := coalesce(
    (
      select game_status
      from public.lesson_settings
      where slice_key = p_slice_key
    ),
    'none'
  );
  v_core_asset_count integer := public.count_uploaded_core_assets(p_assets);
  v_has_activity boolean := public.has_uploaded_asset(p_assets, 'activity');
  v_status text := case
    when v_core_asset_count = 3
      and (v_game_status <> 'available' or v_has_activity) then 'live'
    when v_core_asset_count > 0 or v_has_activity then 'partial'
    else 'empty'
  end;
begin
  insert into public.lesson_availability (slice_key, asset_count, game_status, status, updated_at)
  values (p_slice_key, v_asset_count, v_game_status, v_status, timezone('utc', now()))
  on conflict (slice_key) do update
  set asset_count = excluded.asset_count,
      game_status = excluded.game_status,
      status = excluded.status,
      updated_at = excluded.updated_at;
end;
$$;

create or replace function public.sync_lesson_availability_from_assets()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_lesson_availability(new.slice_key, new.assets);
  return new;
end;
$$;

create or replace function public.sync_lesson_availability_from_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slice_key text := coalesce(new.slice_key, old.slice_key);
  v_assets jsonb := coalesce(
    (
      select assets
      from public.lesson_assets
      where slice_key = coalesce(new.slice_key, old.slice_key)
    ),
    '{}'::jsonb
  );
begin
  perform public.sync_lesson_availability(v_slice_key, v_assets);
  return coalesce(new, old);
end;
$$;

create or replace function public.delete_lesson_availability_from_assets()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.lesson_availability
  where slice_key = old.slice_key;

  return old;
end;
$$;

drop trigger if exists lesson_assets_sync_availability on public.lesson_assets;
drop trigger if exists lesson_assets_delete_availability on public.lesson_assets;
drop trigger if exists lesson_settings_sync_availability on public.lesson_settings;

create trigger lesson_assets_sync_availability
after insert or update on public.lesson_assets
for each row
execute function public.sync_lesson_availability_from_assets();

create trigger lesson_assets_delete_availability
after delete on public.lesson_assets
for each row
execute function public.delete_lesson_availability_from_assets();

create trigger lesson_settings_sync_availability
after insert or update or delete on public.lesson_settings
for each row
execute function public.sync_lesson_availability_from_settings();

create table if not exists public.lesson_entitlements (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  slice_key text not null,
  source text not null default 'manual',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint lesson_entitlements_source_check
    check (source in ('free_claim', 'manual', 'purchase', 'grade_pack', 'bundle'))
);

create unique index if not exists lesson_entitlements_unique_source
on public.lesson_entitlements (user_id, slice_key, source);

create unique index if not exists lesson_entitlements_one_free_claim_per_user
on public.lesson_entitlements (user_id)
where source = 'free_claim';

create index if not exists lesson_entitlements_user_slice_idx
on public.lesson_entitlements (user_id, slice_key);

create or replace function public.set_lesson_entitlements_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists lesson_entitlements_set_updated_at on public.lesson_entitlements;

create trigger lesson_entitlements_set_updated_at
before update on public.lesson_entitlements
for each row
execute function public.set_lesson_entitlements_updated_at();

create or replace function public.claim_free_lesson(target_slice_key text)
returns public.lesson_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing_claim public.lesson_entitlements;
  v_claimed public.lesson_entitlements;
  v_live_status text;
begin
  if v_user_id is null then
    raise exception 'Please sign in before claiming a lesson.';
  end if;

  select *
  into v_existing_claim
  from public.lesson_entitlements
  where user_id = v_user_id
    and source = 'free_claim'
  order by created_at asc
  limit 1;

  if v_existing_claim.id is not null then
    if v_existing_claim.slice_key = target_slice_key then
      return v_existing_claim;
    end if;

    raise exception 'You already used your free lesson claim.';
  end if;

  select status
  into v_live_status
  from public.lesson_availability
  where slice_key = target_slice_key;

  if v_live_status is distinct from 'live' then
    raise exception 'This lesson is not available yet.';
  end if;

  insert into public.lesson_entitlements (user_id, slice_key, source)
  values (v_user_id, target_slice_key, 'free_claim')
  returning *
  into v_claimed;

  return v_claimed;
end;
$$;

grant execute on function public.claim_free_lesson(text) to authenticated;

alter table public.lesson_assets enable row level security;
alter table public.lesson_settings enable row level security;
alter table public.lesson_availability enable row level security;
alter table public.lesson_entitlements enable row level security;

drop policy if exists "Public can read lesson assets" on public.lesson_assets;
drop policy if exists "Authenticated users can insert lesson assets" on public.lesson_assets;
drop policy if exists "Authenticated users can update lesson assets" on public.lesson_assets;
drop policy if exists "Authenticated users can delete lesson assets" on public.lesson_assets;
drop policy if exists "Admins can read lesson assets" on public.lesson_assets;
drop policy if exists "Admins can insert lesson assets" on public.lesson_assets;
drop policy if exists "Admins can update lesson assets" on public.lesson_assets;
drop policy if exists "Admins can delete lesson assets" on public.lesson_assets;
drop policy if exists "Public can read lesson settings" on public.lesson_settings;
drop policy if exists "Admins can manage lesson settings" on public.lesson_settings;

create policy "Admins can read lesson assets"
on public.lesson_assets
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert lesson assets"
on public.lesson_assets
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update lesson assets"
on public.lesson_assets
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete lesson assets"
on public.lesson_assets
for delete
to authenticated
using (public.is_admin());

create policy "Public can read lesson settings"
on public.lesson_settings
for select
using (true);

create policy "Admins can manage lesson settings"
on public.lesson_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read lesson availability" on public.lesson_availability;

create policy "Public can read lesson availability"
on public.lesson_availability
for select
using (true);

drop policy if exists "Users can read their lesson entitlements" on public.lesson_entitlements;
drop policy if exists "Admins can manage lesson entitlements" on public.lesson_entitlements;

create policy "Users can read their lesson entitlements"
on public.lesson_entitlements
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage lesson entitlements"
on public.lesson_entitlements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.lesson_availability to anon, authenticated;
grant select, insert, update, delete on public.lesson_assets to authenticated;
grant select on public.lesson_settings to anon, authenticated;
grant insert, update, delete on public.lesson_settings to authenticated;
grant select on public.lesson_entitlements to authenticated;
grant insert, update, delete on public.lesson_entitlements to authenticated;

insert into storage.buckets (id, name, public)
values ('lesson-assets', 'lesson-assets', false)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

drop policy if exists "Public can read lesson storage" on storage.objects;
drop policy if exists "Authenticated users can upload lesson storage" on storage.objects;
drop policy if exists "Authenticated users can update lesson storage" on storage.objects;
drop policy if exists "Authenticated users can delete lesson storage" on storage.objects;
drop policy if exists "Admins can read lesson storage" on storage.objects;
drop policy if exists "Admins can upload lesson storage" on storage.objects;
drop policy if exists "Admins can update lesson storage" on storage.objects;
drop policy if exists "Admins can delete lesson storage" on storage.objects;

create policy "Admins can read lesson storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'lesson-assets'
  and public.is_admin()
);

create policy "Admins can upload lesson storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lesson-assets'
  and public.is_admin()
);

create policy "Admins can update lesson storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'lesson-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'lesson-assets'
  and public.is_admin()
);

create policy "Admins can delete lesson storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lesson-assets'
  and public.is_admin()
);

select public.sync_lesson_availability(slice_key, assets)
from public.lesson_assets;
