import React from 'react';
import { ArrowRight, Receipt } from 'lucide-react';

export default function EmptyState({
  title = 'Todavía no tenés movimientos',
  description = 'Registrá tu primer ingreso o gasto para empezar a entender cómo se mueve tu dinero.',
  actionLabel = 'Registrar movimiento',
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 sm:p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Receipt className="h-7 w-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
