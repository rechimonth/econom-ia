# ECONOM-IA — Billing Pro con Stripe

## Modelo comercial

- Producto: `Econom-IA Pro`
- Modalidad: suscripción recurrente mensual
- Moneda: USD
- Precio inicial: USD 9,99/mes
- Sin prueba gratuita en la primera versión
- Renovación automática gestionada por Stripe Billing
- Cancelación por defecto: al final del período ya pagado
- Downgrade: cancelación a fin de período; el acceso Pro continúa hasta `current_period_end`
- Reactivación: disponible desde Customer Portal o el endpoint interno de resume
- Protección antiabuso Pro: 1.000 consultas IA por mes

Stripe recomienda usar Checkout Sessions en `mode=subscription` para el alta y Billing Customer Portal para gestión de suscripciones, métodos de pago y cancelación. citeturn950237view0turn950237view1

## 1. Crear el producto y Price

Copiá `server/.env.example` como `server/.env` y cargá una `STRIPE_SECRET_KEY` de Stripe Test Mode.

Después ejecutá:

```bash
npm --prefix server install
npm --prefix server run billing:create-price
```

El script crea o reutiliza:

- Producto `Econom-IA Pro`
- Price recurrente USD 9,99/mes
- `recurring.interval=month`

La salida contiene:

```text
STRIPE_PRO_PRICE_ID=price_...
```

Copiá ese valor en `server/.env`.

No guardes nunca `STRIPE_SECRET_KEY` ni `STRIPE_WEBHOOK_SECRET` en Git.

## 2. Configurar Customer Portal

En Stripe Dashboard, dentro del entorno Test/Sandbox, habilitá Customer Portal para el catálogo utilizado por Econom-IA.

Debe permitir como mínimo:

- cancelar suscripción
- actualizar método de pago
- consultar facturas
- reanudar una suscripción cancelada al final de período cuando Stripe lo permita

Si en el futuro agregás otro Price Pro (por ejemplo anual), agregalo al catálogo del portal para permitir cambios de precio. Stripe indica que el catálogo debe estar configurado para permitir upgrades/downgrades desde Customer Portal. citeturn950237view1

## 3. Webhook

Endpoint local:

```text
POST http://localhost:8787/api/billing/webhook
```

El servidor verifica `stripe-signature` con `STRIPE_WEBHOOK_SECRET` y procesa de forma idempotente estos eventos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

La sincronización escribe únicamente en la tabla `public.subscriptions`. El cliente nunca puede cambiar `plan` por sí mismo.

Stripe documenta que los webhooks son el mecanismo para recibir cambios del ciclo de vida de suscripciones y del Customer Portal. citeturn950237view1turn950237view2

## 4. Proceso de compra

```text
Free
  ↓
Suscribirme a Pro
  ↓
POST /api/billing/checkout
  ↓
Stripe Checkout
  ↓
pago aprobado
  ↓
Stripe webhook
  ↓
customer.subscription.created/updated
  ↓
Supabase subscriptions = Pro
  ↓
GET /api/me
  ↓
UI Pro
```

El frontend nunca activa Pro por sí mismo.

## 5. Renovación

Stripe Billing realiza automáticamente los cobros recurrentes. Econom-IA escucha `invoice.paid` y actualiza `current_period_end` desde la suscripción de Stripe.

No se implementa ningún loop manual de PaymentIntents para renovar.

## 6. Pago fallido

Cuando llega `invoice.payment_failed`, el backend vuelve a sincronizar la suscripción.

Si Stripe la mantiene `past_due`, la política actual conserva el estado Pro durante el período de recuperación configurado por Stripe.

Si Stripe termina la suscripción, `customer.subscription.deleted` mueve al usuario a Free y elimina el vínculo de suscripción activa.

## 7. Cancelación

La política de Econom-IA es `cancel_at_period_end=true`.

Eso significa:

```text
Usuario cancela hoy
        ↓
No se genera otro cobro al renovar
        ↓
Pro continúa hasta current_period_end
        ↓
Stripe finaliza la suscripción
        ↓
webhook customer.subscription.deleted
        ↓
Free
```

El botón `Administrar suscripción` abre Customer Portal.

También existe:

```text
POST /api/billing/cancel
POST /api/billing/resume
```

protegidos por Supabase Auth.

## 8. Producción

Cambiar únicamente las credenciales y Price ID por los equivalentes Live Mode:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
PUBLIC_APP_URL=https://econom-ia.app
```

Y registrar en Stripe el webhook de producción:

```text
https://api.econom-ia.app/api/billing/webhook
```

## 9. Migraciones

Las tablas de billing están en:

```text
supabase/migrations/20260916020000_stripe_billing.sql
supabase/migrations/20260916020500_refund_ai_quota.sql
supabase/migrations/20260916021000_cap_pro_ai_quota.sql
```

Después de desplegarlas, verificá en Supabase:

```sql
select user_id,
       plan,
       status,
       current_period_end,
       stripe_customer_id,
       stripe_subscription_id,
       stripe_price_id,
       billing_currency,
       billing_unit_amount,
       billing_interval,
       cancel_at_period_end
from public.subscriptions;
```

## 10. Prueba local con Stripe CLI

Instalá Stripe CLI y ejecutá:

```bash
stripe login
stripe listen --forward-to localhost:8787/api/billing/webhook
```

La CLI entregará un `whsec_...`; colocá ese valor en `server/.env` como `STRIPE_WEBHOOK_SECRET`.

Luego ejecutá:

```bash
npm run server:dev
npm run dev
```

Probá el checkout en Test/Sandbox y verificá simultáneamente:

```text
Stripe Events
Supabase subscriptions
GET /api/me
UI ECONOM-IA
```
