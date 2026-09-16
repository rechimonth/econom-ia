alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text,
  add column if not exists billing_currency text,
  add column if not exists billing_unit_amount integer,
  add column if not exists billing_interval text,
  add column if not exists cancel_at_period_end boolean not null default false;

create unique index if not exists subscriptions_stripe_customer_id_uidx
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists subscriptions_stripe_subscription_id_uidx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists subscriptions_stripe_price_id_idx
  on public.subscriptions (stripe_price_id);

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

drop policy if exists "users cannot access stripe webhook events" on public.stripe_webhook_events;

revoke all on table public.stripe_webhook_events from public;
revoke all on table public.stripe_webhook_events from anon;
revoke all on table public.stripe_webhook_events from authenticated;
