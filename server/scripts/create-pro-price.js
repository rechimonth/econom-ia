import 'dotenv/config';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required.');
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2026-02-25.clover',
});

const productName = process.env.STRIPE_PRO_PRODUCT_NAME || 'Econom-IA Pro';
const productDescription = process.env.STRIPE_PRO_PRODUCT_DESCRIPTION || 'Copiloto financiero con cuota Pro y acceso ampliado a IA.';
const amount = Number(process.env.STRIPE_PRO_UNIT_AMOUNT || 999);
const currency = (process.env.BILLING_CURRENCY || 'usd').toLowerCase();
const interval = process.env.BILLING_INTERVAL || 'month';

if (!Number.isInteger(amount) || amount <= 0) {
  throw new Error('STRIPE_PRO_UNIT_AMOUNT must be a positive integer in the smallest currency unit.');
}

const products = await stripe.products.list({ active: true, limit: 100 });
let product = products.data.find(
  (candidate) => candidate.metadata?.app === 'econom-ia' && candidate.metadata?.plan === 'Pro',
);

if (!product) {
  product = await stripe.products.create({
    name: productName,
    description: productDescription,
    metadata: { app: 'econom-ia', plan: 'Pro' },
  });
}

const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
let price = prices.data.find(
  (candidate) =>
    candidate.currency === currency &&
    candidate.unit_amount === amount &&
    candidate.recurring?.interval === interval &&
    candidate.metadata?.app === 'econom-ia' &&
    candidate.metadata?.plan === 'Pro',
);

if (!price) {
  price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency,
    recurring: { interval },
    metadata: { app: 'econom-ia', plan: 'Pro' },
  });
}

console.log(JSON.stringify({
  productId: product.id,
  priceId: price.id,
  currency: price.currency,
  unitAmount: price.unit_amount,
  interval: price.recurring?.interval,
  env: `STRIPE_PRO_PRICE_ID=${price.id}`,
}, null, 2));
