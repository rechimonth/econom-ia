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
  v_limit integer;
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

  if v_status not in ('active', 'trialing', 'past_due') then
    return false;
  end if;

  if v_period_end is null or v_period_end <= now() then
    return false;
  end if;

  v_limit := case when v_plan = 'Pro' then 1000 else 3 end;

  insert into public.ai_usage (user_id, usage_month, query_count, updated_at)
  values (p_user_id, p_usage_month, 1, now())
  on conflict (user_id, usage_month)
  do update set
    query_count = public.ai_usage.query_count + 1,
    updated_at = now()
  where public.ai_usage.query_count < v_limit
  returning query_count into v_query_count;

  return found and v_query_count <= v_limit;
end;
$$;

revoke all on function private.increment_ai_quota(uuid, text) from public;
revoke all on function private.increment_ai_quota(uuid, text) from authenticated;
revoke all on function private.increment_ai_quota(uuid, text) from anon;
grant execute on function private.increment_ai_quota(uuid, text) to service_role;
