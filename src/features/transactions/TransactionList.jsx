import React from 'react';
import EmptyState from '../../components/ui/EmptyState';

function formatAmount(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
}

function TransactionSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-800" />
            <div className="h-2.5 w-1/5 animate-pulse rounded bg-slate-800" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export default function TransactionList({ transactions, loading = false, onEdit, onDelete, onCreateFirst }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-black text-white">Historial</h3>
        <p className="text-xs text-slate-500">{transactions.length} movimiento{transactions.length === 1 ? '' : 's'}</p>
      </div>

      {loading ? <TransactionSkeleton /> : transactions.length === 0 ? (
        <EmptyState onAction={onCreateFirst} />
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';

            return (
              <article key={transaction.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {isIncome ? <span aria-hidden="true">↑</span> : <span aria-hidden="true">↓</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-white">{transaction.description}</h4>
                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500">
                    <span>{transaction.date}</span><span>•</span><span>{transaction.category || 'General'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className={`font-mono text-sm font-black ${isIncome ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isIncome ? '+' : '-'} {formatAmount(transaction.amount)}
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => onEdit(transaction)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-sky-300" aria-label={`Editar ${transaction.description}`}>
                      ✎
                    </button>
                    <button type="button" onClick={() => onDelete(transaction)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-rose-300" aria-label={`Eliminar ${transaction.description}`}>
                      ×
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
