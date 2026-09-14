import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Loader2, Plus, Save, X } from 'lucide-react';
import { useToast } from '../../components/feedback/ToastProvider';
import { getTodayInputDate, validateTransaction } from './transactionValidation';

const INITIAL_FORM = {
  type: 'expense',
  description: '',
  amount: '',
  date: getTodayInputDate(),
  category: 'General',
};

const CATEGORIES = ['General', 'Alimentos', 'Vivienda', 'Transporte', 'Salud', 'Entretenimiento', 'Trabajo', 'Otros'];

export default function TransactionForm({ editingTransaction = null, onSubmit, onCancelEdit }) {
  const { pushToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editingTransaction) {
      setForm(INITIAL_FORM);
      setErrors({});
      return;
    }

    setForm({
      type: editingTransaction.type,
      description: editingTransaction.description,
      amount: String(editingTransaction.amount),
      date: editingTransaction.date,
      category: editingTransaction.category || 'General',
    });
    setErrors({});
  }, [editingTransaction]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateTransaction(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      pushToast({ type: 'error', title: 'Revisá el formulario', message: 'Hay campos que necesitan corrección.' });
      return;
    }

    setBusy(true);

    try {
      await onSubmit({
        type: form.type,
        description: form.description.trim(),
        amount: Number(form.amount),
        date: form.date,
        category: form.category,
      });

      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      console.error(error);
      pushToast({ type: 'error', title: 'No se pudo guardar', message: error.message || 'Intentá nuevamente.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-white">{editingTransaction ? 'Editar movimiento' : 'Nuevo movimiento'}</h3>
          <p className="mt-1 text-xs text-slate-400">Todos los campos principales son obligatorios.</p>
        </div>
        {editingTransaction && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white" disabled={busy}>
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
              <button key={type} type="button" onClick={() => setForm((current) => ({ ...current, type }))} disabled={busy} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${form.type === type ? (type === 'income' ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/60 bg-rose-500/10 text-rose-300') : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'} disabled:cursor-not-allowed disabled:opacity-60`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          {errors.type && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="transaction-description" className="mb-2 block text-xs font-bold text-slate-300">Descripción</label>
          <input id="transaction-description" value={form.description} disabled={busy} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60" placeholder="Ej. Supermercado" />
          {errors.description && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="transaction-amount" className="mb-2 block text-xs font-bold text-slate-300">Monto</label>
          <input id="transaction-amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} disabled={busy} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60" placeholder="0,00" />
          {errors.amount && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="transaction-date" className="mb-2 block text-xs font-bold text-slate-300">Fecha</label>
          <input id="transaction-date" type="date" max={getTodayInputDate()} value={form.date} disabled={busy} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60" />
          {errors.date && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="transaction-category" className="mb-2 block text-xs font-bold text-slate-300">Categoría</label>
          <select id="transaction-category" value={form.category} disabled={busy} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60">
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editingTransaction ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {busy ? 'Guardando…' : editingTransaction ? 'Guardar cambios' : 'Registrar movimiento'}
          </button>
        </div>
      </form>
    </section>
  );
}
