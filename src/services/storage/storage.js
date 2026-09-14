const STORAGE_KEYS = Object.freeze({
  userProfile: 'economia_user_profile',
  recentTickets: 'economia_tickets',
  transactions: 'economia_transactions',
});

const MAX_AMOUNT = 999_999_999_999;

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

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function assertValidTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') {
    throw new Error('Invalid transaction.');
  }

  if (!['income', 'expense'].includes(transaction.type)) {
    throw new Error('Invalid transaction type.');
  }

  const description = String(transaction.description ?? '').trim();
  if (description.length < 2 || description.length > 100) {
    throw new Error('Invalid transaction description.');
  }

  const amount = Number(transaction.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    throw new Error('Invalid transaction amount.');
  }

  const date = String(transaction.date ?? '');
  const today = getLocalDateString();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid transaction date.');
  }

  if (date > today) {
    throw new Error('Transaction date cannot be in the future.');
  }
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
  assertValidTransaction(transaction);

  const transactions = getTransactions();
  const timestamp = new Date().toISOString();
  const nextTransaction = {
    ...transaction,
    id: createId(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveTransactions([nextTransaction, ...transactions]);
  return nextTransaction;
}

export function updateTransaction(transactionId, updates) {
  const transactions = getTransactions();
  const existing = transactions.find((transaction) => transaction.id === transactionId);

  if (!existing) {
    throw new Error('Transaction not found.');
  }

  const nextTransaction = {
    ...existing,
    ...updates,
    id: transactionId,
    updatedAt: new Date().toISOString(),
  };

  assertValidTransaction(nextTransaction);

  const updatedTransactions = transactions.map((transaction) =>
    transaction.id === transactionId ? nextTransaction : transaction,
  );

  saveTransactions(updatedTransactions);
  return nextTransaction;
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
