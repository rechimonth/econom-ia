import React, { useState } from 'react';
import { Crown, Sparkles, LoaderCircle } from 'lucide-react';
import { openBillingPortal, startProCheckout } from '../../services/billing/stripeBilling';

function formatPrice(billing) {
  if (!billing?.unitAmount || !billing?.currency || !billing?.interval) return 'Pro mensual';

  const amount = billing.unitAmount / 100;
  const currency = String(billing.currency).toUpperCase();
  const locale = currency === 'USD' ? 'en-US' : 'es-AR';
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

  return `${formatted} / ${billing.interval === 'month' ? 'mes' : billing.interval}`;
}

export default function UpgradeBanner({ remainingQueries, isPro = false, billing = null, onBillingChanged }) {
  const [busy, setBusy] = useState(false);
  const exhausted = remainingQueries === 0;
  const canceledAtPeriodEnd = Boolean(billing?.cancelAtPeriodEnd);

  const handleBilling = async () => {
    setBusy(true);

    try {
      if (isPro) {
        await openBillingPortal();
      } else {
        await startProCheckout();
      }
    } catch (error) {
      console.error('[billing] Unable to open Stripe flow.', error);
      onBillingChanged?.({ error });
      setBusy(false);
    }
  };

  return (
    <aside className={`border-b px-4 py-3 ${isPro ? 'border-sky-500/20 bg-sky-500/5' : 'border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-950/70 to-sky-500/10'}`} role="status">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isPro ? 'bg-sky-400/10 text-sky-300' : 'bg-amber-400/10 text-amber-300'}`}>
            {isPro ? <Crown className="h-4.5 w-4.5" /> : exhausted ? <Crown className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">
              {isPro
                ? canceledAtPeriodEnd
                  ? 'Tu Pro está programado para cancelar al final del período actual.'
                  : 'Plan Pro activo.'
                : exhausted
                  ? 'Alcanzaste el límite de 3 consultas gratuitas este mes.'
                  : `Plan Free: ${remainingQueries} consulta${remainingQueries === 1 ? '' : 's'} restante${remainingQueries === 1 ? '' : 's'} este mes.`}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {isPro
                ? `${formatPrice(billing)} · administrá pago, cancelación o cambios desde Stripe.`
                : 'Pro mensual con renovación automática. Stripe gestiona el cobro y la suscripción.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBilling}
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
          {busy ? 'Abriendo Stripe…' : isPro ? 'Administrar suscripción' : 'Suscribirme a Pro'}
        </button>
      </div>
    </aside>
  );
}
