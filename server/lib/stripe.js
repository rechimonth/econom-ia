import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRO_PRICE_ID;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required.');
}

if (!priceId) {
  throw new Error('STRIPE_PRO_PRICE_ID is required.');
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required.');
}

export const stripe = new Stripe(secretKey, {
  apiVersion: '2026-02-25.clover',
  maxNetworkRetries: 2,
  timeout: 30_000,
});

export const STRIPE_PRO_PRICE_ID = priceId;
export const STRIPE_WEBHOOK_SECRET = webhookSecret;
export const BILLING_CURRENCY = (process.env.BILLING_CURRENCY || 'usd').toLowerCase();
export const BILLING_INTERVAL = process.env.BILLING_INTERVAL || 'month';
export const BILLING_CANCEL_AT_PERIOD_END = process.env.BILLING_CANCEL_AT_PERIOD_END !== 'false';
export const PUBLIC_APP_URL = (process.env.PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
