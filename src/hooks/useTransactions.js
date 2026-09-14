import { useCallback, useState } from 'react';
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../services/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => getTransactions());

  const create = useCallback((transaction) => {
    const saved = addTransaction(transaction);
    setTransactions((current) => [saved, ...current]);
    return saved;
  }, []);

  const update = useCallback((transactionId, updates) => {
    const saved = updateTransaction(transactionId, updates);
    setTransactions((current) =>
      current.map((transaction) => transaction.id === transactionId ? saved : transaction)
    );
    return saved;
  }, []);

  const remove = useCallback((transactionId) => {
    deleteTransaction(transactionId);
    setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId));
  }, []);

  return { transactions, create, update, remove };
}
