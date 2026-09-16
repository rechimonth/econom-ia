import 'dotenv/config';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required.');
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2026-02-25.clover',
});

const product = await stripe.products.create({
  name: process.env.STRIPE_PRO_PRODUCT_NAME || 'Econom-IA Pro',
  description: process.env.STRIPE_PRO_PRODUCT_DESCRIPTION || 'Copiloto financiero con cuota Pro y acceso ampliado a IA.',
  metadata: {
    app: 'econom-ia',
    plan: 'Pro',
  },
});

const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 999,
  currency: 'usd',
  recurring: { interval: 'month' },
  metadata: {
    app: 'econom-ia',
    plan: 'Pro',
  },
});

console.log(JSON.stringify({
  productId: product.id,
  priceId: price.id,
  currency: price.currency,
  unitAmount: price.unit_amount,
  interval: price.recurring?.interval,
}, null, 2));
