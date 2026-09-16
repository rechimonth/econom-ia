import { STRIPE_WEBHOOK_SECRET, stripe } from '../lib/stripe.js';
import { supabaseAdmin } from '../supabaseAdmin.js';
import { syncStripeSubscription } from '../services/billingService.js';

async function claimWebhookEvent(event) {
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('stripe_webhook_events')
    .select('event_id, processed_at')
    .eq('event_id', event.id)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existing?.processed_at) return false;

  const { error: insertError } = await supabaseAdmin
    .from('stripe_webhook_events')
    .upsert({
      event_id: event.id,
      event_type: event.type,
      processed_at: null,
      last_error: null,
    }, { onConflict: 'event_id' });

  if (insertError) throw insertError;
  return true;
}

async function markWebhookProcessed(eventId) {
  const { error } = await supabaseAdmin
    .from('stripe_webhook_events')
    .update({ processed_at: new Date().toISOString(), last_error: null })
    .eq('event_id', eventId);

  if (error) throw error;
}

async function markWebhookFailed(eventId, error) {
  await supabaseAdmin
    .from('stripe_webhook_events')
    .update({ last_error: String(error?.message || error).slice(0, 2000) })
    .eq('event_id', eventId);
}

async function syncSubscriptionById(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product'],
  });

  return syncStripeSubscription(subscription);
}

export async function billingWebhookController(req, res) {
  const signature = req.get('stripe-signature');

  if (!signature) {
    return res.status(400).json({ error: 'STRIPE_SIGNATURE_REQUIRED' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('[stripe] Invalid webhook signature:', error);
    return res.status(400).json({ error: 'STRIPE_SIGNATURE_INVALID' });
  }

  try {
    const shouldProcess = await claimWebhookEvent(event);
    if (!shouldProcess) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          await syncSubscriptionById(String(session.subscription));
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncStripeSubscription(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await syncStripeSubscription(event.data.object, { deleted: true });
        break;

      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await syncSubscriptionById(String(invoice.subscription));
        }
        break;
      }

      default:
        break;
    }

    await markWebhookProcessed(event.id);
    return res.status(200).json({ received: true });
  } catch (error) {
    await markWebhookFailed(event.id, error);
    console.error('[stripe] Webhook processing failed:', error);
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_PROCESSING_FAILED' });
  }
}
