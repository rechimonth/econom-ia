create schema if not exists private;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'subscription_plan'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.subscription_plan as enum ('Free', 'Pro');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'subscription_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.subscription_status as enum ('active', 'canceled', 'past_due', 'trialing');
  end if;
end
$$;

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan public.subscription_plan not null default 'Free',
  status public.subscription_status not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_month text not null check (usage_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  query_count integer not null default 0 check (query_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_month)
);

create index if not exists ai_usage_user_month_idx
  on public.ai_usage (user_id, usage_month);

create or replace function private.handle_new_user_subscription()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'Free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user_subscription() from public;

 drop trigger if exists on_auth_user_created_subscription on auth.users;
create trigger on_auth_user_created_subscription
after insert on auth.users
for each row
execute function private.handle_new_user_subscription();

create or replace function private.increment_ai_quota(
  p_user_id uuid,
  p_usage_month text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan public.subscription_plan;
  v_status public.subscription_status;
  v_period_end timestamptz;
  v_query_count integer;
begin
  if p_user_id is null then
    return false;
  end if;

  if p_usage_month !~ '^\d{4}-(0[1-9]|1[0-2])$' then
    raise exception 'Invalid usage month';
  end if;

  select plan, status, current_period_end
    into v_plan, v_status, v_period_end
  from public.subscriptions
  where user_id = p_user_id;

  if not found then
    return false;
  end if;

  if v_status not in ('active', 'trialing') then
    return false;
  end if;

  if v_plan = 'Pro' and (v_period_end is null or v_period_end > now()) then
    insert into public.ai_usage (user_id, usage_month, query_count, updated_at)
    values (p_user_id, p_usage_month, 1, now())
    on conflict (user_id, usage_month)
    do update set
      query_count = public.ai_usage.query_count + 1,
      updated_at = now();

    return true;
  end if;

  insert into public.ai_usage (user_id, usage_month, query_count, updated_at)
  values (p_user_id, p_usage_month, 1, now())
  on conflict (user_id, usage_month)
  do update set
    query_count = public.ai_usage.query_count + 1,
    updated_at = now()
  where public.ai_usage.query_count < 3
  returning query_count into v_query_count;

  return found and v_query_count <= 3;
end;
$$;

revoke all on function private.increment_ai_quota(uuid, text) from public;
revoke all on function private.increment_ai_quota(uuid, text) from authenticated;
revoke all on function private.increment_ai_quota(uuid, text) from anon;
grant execute on function private.increment_ai_quota(uuid, text) to service_role;

alter table public.subscriptions enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "users can view own subscription" on public.subscriptions;
create policy "users can view own subscription"
on public.subscriptions
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can view own ai usage" on public.ai_usage;
create policy "users can view own ai usage"
on public.ai_usage
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users cannot mutate subscriptions" on public.subscriptions;

drop policy if exists "users cannot mutate ai usage" on public.ai_usage;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute function private.set_updated_at();

drop trigger if exists ai_usage_set_updated_at on public.ai_usage;
create trigger ai_usage_set_updated_at
before update on public.ai_usage
for each row
execute function private.set_updated_at();
