import React, { useState } from 'react';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/feedback/ToastProvider';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionSummary from './TransactionSummary';

export default function TransactionManager() {
  const { transactions, create, update, remove } = useTransactions();
  const { pushToast } = useToast();
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const editingTransaction = transactions.find((transaction) => transaction.id === editingId) || null;

  const handleSave = async (payload) => {
    if (editingId) {
      update(editingId, payload);
      pushToast({ title: 'Movimiento actualizado', message: 'El cambio quedó guardado.' });
      setEditingId(null);
      return;
    }

    create(payload);
    pushToast({ title: 'Movimiento guardado', message: 'Tu registro financiero fue guardado correctamente.' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    try {
      remove(deleteTarget.id);
      pushToast({ title: 'Movimiento eliminado', message: 'El registro fue eliminado.' });
      setDeleteTarget(null);

      if (editingId === deleteTarget.id) {
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
      pushToast({ type: 'error', title: 'No se pudo eliminar', message: error.message || 'Intentá nuevamente.' });
    }
  };

  return (
    <div className="space-y-6">
      <TransactionSummary transactions={transactions} />

      <TransactionForm
        editingTransaction={editingTransaction}
        onSubmit={handleSave}
        onCancelEdit={() => setEditingId(null)}
      />

      <TransactionList
        transactions={transactions}
        onEdit={(transaction) => setEditingId(transaction.id)}
        onDelete={setDeleteTarget}
        onCreateFirst={() => document.getElementById('transaction-description')?.focus()}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="¿Eliminar movimiento?"
        description={deleteTarget ? `Se eliminará “${deleteTarget.description}”. Esta acción no se puede deshacer.` : ''}
        confirmLabel="Sí, eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
