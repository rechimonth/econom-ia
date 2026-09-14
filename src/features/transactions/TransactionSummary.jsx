import React, { useMemo } from 'react';

function formatAmount(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function TransactionSummary({ transactions }) {
  const totals = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          const amount = Number(transaction.amount);
          if (transaction.type === 'income') result.income += amount;
          else result.expense += amount;
          return result;
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  );

  const net = totals.income - totals.expense;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Control financiero</div>
        <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Movimientos</h2>
        <p className="mt-1 text-sm text-slate-400">Registrá ingresos y gastos para construir una fuente de verdad única para tu economía.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-xs text-slate-400">Ingresos</div>
          <div className="mt-1 text-lg font-black text-emerald-300">{formatAmount(totals.income)}</div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="text-xs text-slate-400">Gastos</div>
          <div className="mt-1 text-lg font-black text-rose-300">{formatAmount(totals.expense)}</div>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
          <div className="text-xs text-slate-400">Balance</div>
          <div className={`mt-1 text-lg font-black ${net >= 0 ? 'text-sky-300' : 'text-amber-300'}`}>{formatAmount(net)}</div>
        </div>
      </div>
    </section>
  );
}
