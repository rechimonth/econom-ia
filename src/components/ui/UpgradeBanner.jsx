import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

export default function UpgradeBanner({ remainingQueries, isPro = false }) {
  const exhausted = remainingQueries === 0;

  const handleViewPlans = () => {
    console.log('Redirigiendo al checkout...');
  };

  if (isPro) {
    return (
      <aside className="border-b border-sky-500/20 bg-sky-500/5 px-4 py-2.5" role="status">
        <p className="text-xs font-semibold text-sky-200">
          Plan Pro · {remainingQueries} consultas disponibles este mes como protección antiabuso.
        </p>
      </aside>
    );
  }

  return (
    <aside className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-950/70 to-sky-500/10 px-4 py-3" role="status">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            {exhausted ? <Crown className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">
              {exhausted
                ? 'Alcanzaste el límite de 3 consultas gratuitas este mes.'
                : `Plan Free: ${remainingQueries} consulta${remainingQueries === 1 ? '' : 's'} restante${remainingQueries === 1 ? '' : 's'} este mes.`}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Consultá los planes Pro para ampliar tu cuota mensual.</p>
          </div>
        </div>

        <button type="button" onClick={handleViewPlans} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300">
          <Crown className="h-4 w-4" />
          Ver planes Pro
        </button>
      </div>
    </aside>
  );
}
