const STORAGE_KEYS = Object.freeze({
  userProfile: 'economia_user_profile',
  recentTickets: 'economia_tickets',
  transactions: 'economia_transactions'
});

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function read(key, fallback) {
  if (!hasStorage()) return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) return fallback;

    const parsedValue = JSON.parse(rawValue);
    return parsedValue ?? fallback;
  } catch (error) {
    console.warn(`[storage] Unable to read "${key}". Using fallback value.`, error);
    return fallback;
  }
}

function write(key, value) {
  if (!hasStorage()) return value;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.warn(`[storage] Unable to persist "${key}".`, error);
    return value;
  }
}

function createId(prefix = 'transaction') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getUserProfile(fallback = null) {
  return read(STORAGE_KEYS.userProfile, fallback);
}

export function saveUserProfile(profile) {
  return write(STORAGE_KEYS.userProfile, profile);
}

export function getRecentTickets(fallback = []) {
  return read(STORAGE_KEYS.recentTickets, fallback);
}

export function saveRecentTickets(tickets) {
  return write(STORAGE_KEYS.recentTickets, tickets);
}

export function getTransactions(fallback = []) {
  const transactions = read(STORAGE_KEYS.transactions, fallback);
  return Array.isArray(transactions) ? transactions : fallback;
}

export function saveTransactions(transactions) {
  return write(STORAGE_KEYS.transactions, transactions);
}

export function addTransaction(transaction) {
  const transactions = getTransactions();
  const timestamp = new Date().toISOString();
  const nextTransaction = {
    ...transaction,
    id: transaction?.id ?? createId(),
    createdAt: transaction?.createdAt ?? timestamp,
    updatedAt: timestamp
  };

  saveTransactions([nextTransaction, ...transactions]);
  return nextTransaction;
}

export function updateTransaction(transactionId, updates) {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map((transaction) =>
    transaction.id === transactionId
      ? { ...transaction, ...updates, id: transactionId, updatedAt: new Date().toISOString() }
      : transaction
  );

  saveTransactions(updatedTransactions);
  return updatedTransactions.find((transaction) => transaction.id === transactionId) ?? null;
}

export function deleteTransaction(transactionId) {
  const transactions = getTransactions();
  const nextTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
  saveTransactions(nextTransactions);
  return nextTransactions;
}

export function clearTransactions() {
  return saveTransactions([]);
}

export { STORAGE_KEYS };
