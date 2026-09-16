create or replace function public.increment_ai_quota(
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

  -- Pro is only active while an explicit paid/trial period exists.
  -- A NULL period is treated as inactive instead of granting perpetual Pro.
  if v_plan = 'Pro' and v_period_end is not null and v_period_end > now() then
    insert into public.ai_usage (user_id, usage_month, query_count, updated_at)
    values (p_user_id, p_usage_month, 1, now())
    on conflict (user_id, usage_month)
    do update set
      query_count = public.ai_usage.query_count + 1,
      updated_at = now()
    where public.ai_usage.query_count < 1000
    returning query_count into v_query_count;

    return found and v_query_count <= 1000;
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

revoke all on function public.increment_ai_quota(uuid, text) from public;
revoke all on function public.increment_ai_quota(uuid, text) from authenticated;
revoke all on function public.increment_ai_quota(uuid, text) from anon;
grant execute on function public.increment_ai_quota(uuid, text) to service_role;

create or replace function public.refund_ai_quota(
  p_user_id uuid,
  p_usage_month text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_query_count integer;
begin
  if p_user_id is null then
    return false;
  end if;

  if p_usage_month !~ '^\d{4}-(0[1-9]|1[0-2])$' then
    raise exception 'Invalid usage month';
  end if;

  update public.ai_usage
     set query_count = query_count - 1,
         updated_at = now()
   where user_id = p_user_id
     and usage_month = p_usage_month
     and query_count > 0
   returning query_count into v_query_count;

  return found;
end;
$$;

revoke all on function public.refund_ai_quota(uuid, text) from public;
revoke all on function public.refund_ai_quota(uuid, text) from authenticated;
revoke all on function public.refund_ai_quota(uuid, text) from anon;
grant execute on function public.refund_ai_quota(uuid, text) to service_role;
