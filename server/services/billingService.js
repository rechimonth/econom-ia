import {
  BILLING_CANCEL_AT_PERIOD_END,
  BILLING_INTERVAL,
  BILLING_CURRENCY,
  PUBLIC_APP_URL,
  STRIPE_PRO_PRICE_ID,
  stripe,
} from '../lib/stripe.js';
import { supabaseAdmin } from '../supabaseAdmin.js';

const ACTIVE_PLAN_STATUSES = new Set(['active', 'trialing', 'past_due']);

function normalizeStripeStatus(status, deleted = false) {
  if (deleted || status === 'canceled' || status === 'incomplete_expired') return 'canceled';
  if (status === 'trialing') return 'trialing';
  if (status === 'active') return 'active';
  return 'past_due';
}

function getSubscriptionPrice(subscription) {
  return subscription.items?.data?.[0]?.price || null;
}

function getUserIdFromSubscription(subscription) {
  return subscription.metadata?.user_id || subscription.client_reference_id || null;
}

async function findUserIdByStripeCustomer(stripeCustomerId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle();

  if (error) throw error;
  return data?.user_id || null;
}

export async function findOrCreateStripeCustomer(userId, email) {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: email || undefined,
    metadata: { user_id: userId },
  });

  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({ stripe_customer_id: customer.id })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  return customer.id;
}

export async function syncStripeSubscription(subscription, { deleted = false } = {}) {
  const stripeCustomerId = String(subscription.customer);
  const price = getSubscriptionPrice(subscription);
  const metadataUserId = getUserIdFromSubscription(subscription);
  const userId = metadataUserId || (await findUserIdByStripeCustomer(stripeCustomerId));

  if (!userId) {
    throw new Error(`Unable to map Stripe customer ${stripeCustomerId} to a Supabase user.`);
  }

  const status = normalizeStripeStatus(subscription.status, deleted);
  const supportedProPrice = price?.id === STRIPE_PRO_PRICE_ID;
  const plan = supportedProPrice && !deleted && ACTIVE_PLAN_STATUSES.has(subscription.status) ? 'Pro' : 'Free';
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;
  const cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      plan,
      status,
      current_period_end: currentPeriodEnd,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: deleted ? null : subscription.id,
      stripe_price_id: deleted ? null : price?.id || null,
      billing_currency: deleted ? null : (price?.currency || BILLING_CURRENCY).toLowerCase(),
      billing_unit_amount: deleted ? null : price?.unit_amount ?? null,
      billing_interval: deleted ? null : (price?.recurring?.interval || BILLING_INTERVAL),
      cancel_at_period_end: deleted ? false : cancelAtPeriodEnd,
    })
    .eq('user_id', userId);

  if (error) throw error;

  return {
    userId,
    plan,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    priceId: price?.id || null,
    currency: price?.currency || null,
    unitAmount: price?.unit_amount ?? null,
  };
}

export async function createCheckoutSession({ userId, email }) {
  const customerId = await findOrCreateStripeCustomer(userId, email);

  const { data: current, error } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status, stripe_subscription_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  if (current?.plan === 'Pro' && ACTIVE_PLAN_STATUSES.has(current.status)) {
    const portal = await createPortalSession({ userId });
    return { type: 'portal', url: portal.url };
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: userId,
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    success_url: `${PUBLIC_APP_URL}/?billing=success`,
    cancel_url: `${PUBLIC_APP_URL}/?billing=cancelled`,
    metadata: { user_id: userId },
    subscription_data: {
      metadata: { user_id: userId },
    },
  });

  return { type: 'checkout', url: session.url };
}

export async function createPortalSession({ userId }) {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!subscription?.stripe_customer_id) {
    throw new Error('STRIPE_CUSTOMER_NOT_FOUND');
  }

  return stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${PUBLIC_APP_URL}/?billing=portal-return`,
  });
}

export async function cancelSubscriptionAtPeriodEnd(userId) {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id, plan, status')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!subscription?.stripe_subscription_id || subscription.plan !== 'Pro') {
    throw new Error('ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND');
  }

  const updated = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: BILLING_CANCEL_AT_PERIOD_END,
  });

  return syncStripeSubscription(updated);
}

export async function resumeSubscription(userId) {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id, plan')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!subscription?.stripe_subscription_id || subscription.plan !== 'Pro') {
    throw new Error('ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND');
  }

  const updated = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
  });

  return syncStripeSubscription(updated);
}
