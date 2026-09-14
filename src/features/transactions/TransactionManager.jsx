import React, { useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Edit3, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/feedback/ToastProvider';
import { useTransactions } from '../../hooks/useTransactions';
import { getTodayInputDate, validateTransaction } from './transactionValidation';

const INITIAL_FORM = {
  type: 'expense',
  description: '',
  amount: '',
  date: getTodayInputDate(),
  category: 'General',
};

const CATEGORIES = ['General', 'Alimentos', 'Vivienda', 'Transporte', 'Salud', 'Entretenimiento', 'Trabajo', 'Otros'];

function formatAmount(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(value);
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

export default function TransactionManager() {
  const { transactions, create, update, remove } = useTransactions();
  const { pushToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loadingList, setLoadingList] = useState(false);

  const totals = useMemo(() => transactions.reduce((result, transaction) => {
    const amount = Number(transaction.amount);
    if (transaction.type === 'income') result.income += amount;
    else result.expense += amount;
    return result;
  }, { income: 0, expense: 0 }), [transactions]);

  const net = totals.income - totals.expense;

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateTransaction(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      pushToast({ type: 'error', title: 'Revisá el formulario', message: 'Hay campos que necesitan corrección.' });
      return;
    }

    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const payload = {
      type: form.type,
      description: form.description.trim(),
      amount: Number(form.amount),
      date: form.date,
      category: form.category,
    };

    try {
      if (editingId) {
        update(editingId, payload);
        pushToast({ title: 'Movimiento actualizado', message: 'El cambio quedó guardado.' });
      } else {
        create(payload);
        pushToast({ title: 'Movimiento guardado', message: 'Tu registro financiero fue guardado correctamente.' });
      }
      resetForm();
    } catch (error) {
      console.error(error);
      pushToast({ type: 'error', title: 'No se pudo guardar', message: 'Intentá nuevamente.' });
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setForm({
      type: transaction.type,
      description: transaction.description,
      amount: String(transaction.amount),
      date: transaction.date,
      category: transaction.category || 'General',
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    try {
      remove(deleteTarget.id);
      pushToast({ title: 'Movimiento eliminado', message: 'El registro fue eliminado.' });
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) resetForm();
    } catch (error) {
      console.error(error);
      pushToast({ type: 'error', title: 'No se pudo eliminar', message: 'Intentá nuevamente.' });
    } finally {
      setBusy(false);
    }
  };

  const refreshVisualState = async () => {
    setLoadingList(true);
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    setLoadingList(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Control financiero</div>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Movimientos</h2>
            <p className="mt-1 text-sm text-slate-400">Registrá ingresos y gastos para construir una fuente de verdad única para tu economía.</p>
          </div>
          <button type="button" onClick={refreshVisualState} className="self-start rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
            Actualizar vista
          </button>
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

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white">{editingId ? 'Editar movimiento' : 'Nuevo movimiento'}</h3>
            <p className="mt-1 text-xs text-slate-400">Todos los campos principales son obligatorios.</p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">
              <X className="h-4 w-4" /> Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold text-slate-300">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['expense', 'Gasto', ArrowDownCircle],
                ['income', 'Ingreso', ArrowUpCircle],
              ].map(([type, label, Icon]) => (
                <button key={type} type="button" onClick={() => setForm((current) => ({ ...current, type }))} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${form.type === type ? (type === 'income' ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/60 bg-rose-500/10 text-rose-300') : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
            {errors.type && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="transaction-description" className="mb-2 block text-xs font-bold text-slate-300">Descripción</label>
            <input id="transaction-description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" placeholder="Ej. Supermercado" />
            {errors.description && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="transaction-amount" className="mb-2 block text-xs font-bold text-slate-300">Monto</label>
            <input id="transaction-amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" placeholder="0,00" />
            {errors.amount && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="transaction-date" className="mb-2 block text-xs font-bold text-slate-300">Fecha</label>
            <input id="transaction-date" type="date" max={getTodayInputDate()} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
            {errors.date && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="transaction-category" className="mb-2 block text-xs font-bold text-slate-300">Categoría</label>
            <select id="transaction-category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500">
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {busy ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Registrar movimiento'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white">Historial</h3>
            <p className="text-xs text-slate-500">{transactions.length} movimiento{transactions.length === 1 ? '' : 's'}</p>
          </div>
        </div>

        {loadingList ? <TransactionSkeleton /> : transactions.length === 0 ? (
          <EmptyState onAction={() => document.getElementById('transaction-description')?.focus()} />
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              return (
                <article key={transaction.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isIncome ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
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
                      <button type="button" onClick={() => handleEdit(transaction)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-sky-300" aria-label={`Editar ${transaction.description}`}>
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(transaction)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-rose-300" aria-label={`Eliminar ${transaction.description}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="¿Eliminar movimiento?"
        description={deleteTarget ? `Se eliminará “${deleteTarget.description}” por ${formatAmount(deleteTarget.amount)}. Esta acción no se puede deshacer.` : ''}
        confirmLabel="Sí, eliminar"
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => !busy && setDeleteTarget(null)}
      />
    </div>
  );
}
