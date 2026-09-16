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
