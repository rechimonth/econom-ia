import { createCheckoutSession, createPortalSession, cancelSubscriptionAtPeriodEnd, resumeSubscription } from '../services/billingService.js';

export async function checkoutController(req, res) {
  try {
    const result = await createCheckoutSession({
      userId: req.user_id,
      email: req.user?.email || null,
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error?.message === 'STRIPE_CUSTOMER_NOT_FOUND') {
      return res.status(409).json({ error: 'STRIPE_CUSTOMER_NOT_FOUND', message: 'No billing customer is configured yet.' });
    }

    console.error('[billing] Checkout session creation failed:', error);
    return res.status(502).json({ error: 'CHECKOUT_UNAVAILABLE', message: 'Unable to start the Pro checkout.' });
  }
}

export async function portalController(req, res) {
  try {
    const session = await createPortalSession({ userId: req.user_id });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    if (error?.message === 'STRIPE_CUSTOMER_NOT_FOUND') {
      return res.status(404).json({ error: 'STRIPE_CUSTOMER_NOT_FOUND', message: 'No Stripe customer exists for this account.' });
    }

    console.error('[billing] Portal session creation failed:', error);
    return res.status(502).json({ error: 'PORTAL_UNAVAILABLE', message: 'Unable to open billing management.' });
  }
}

export async function cancelController(req, res) {
  try {
    const subscription = await cancelSubscriptionAtPeriodEnd(req.user_id);
    return res.status(200).json({ subscription });
  } catch (error) {
    if (error?.message === 'ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND') {
      return res.status(404).json({ error: 'ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND', message: 'No active Pro subscription was found.' });
    }

    console.error('[billing] Cancellation failed:', error);
    return res.status(502).json({ error: 'CANCELLATION_UNAVAILABLE', message: 'Unable to cancel the Pro subscription.' });
  }
}

export async function resumeController(req, res) {
  try {
    const subscription = await resumeSubscription(req.user_id);
    return res.status(200).json({ subscription });
  } catch (error) {
    if (error?.message === 'ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND') {
      return res.status(404).json({ error: 'ACTIVE_STRIPE_SUBSCRIPTION_NOT_FOUND', message: 'No active Pro subscription was found.' });
    }

    console.error('[billing] Resume failed:', error);
    return res.status(502).json({ error: 'RESUME_UNAVAILABLE', message: 'Unable to resume the Pro subscription.' });
  }
}
