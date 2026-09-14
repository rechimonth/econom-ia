import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

export default function UpgradeBanner({ remainingQueries, onUpgrade }) {
  const exhausted = remainingQueries === 0;

  return (
    <aside className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-950/70 to-sky-500/10 px-4 py-3" role="status">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            {exhausted ? <Crown className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">
              {exhausted ? 'Alcanzaste el límite de 3 consultas gratuitas este mes.' : `Plan Free: ${remainingQueries} consulta${remainingQueries === 1 ? '' : 's'} restante${remainingQueries === 1 ? '' : 's'} este mes.`}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Pasate a Pro para continuar usando el Copiloto sin este límite.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300"
        >
          <Crown className="h-4 w-4" />
          Upgrade a Pro
        </button>
      </div>
    </aside>
  );
}
