import { useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'economia_subscription';
export const FREE_LIMIT = 3;

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function createDefaultState() {
  return {
    plan: 'Free',
    usageMonth: getCurrentMonthKey(),
    aiQueries: 0,
  };
}

function sanitizeState(input) {
  const currentMonth = getCurrentMonthKey();
  const plan = input?.plan === 'Pro' ? 'Pro' : 'Free';
  const usageMonth = typeof input?.usageMonth === 'string' ? input.usageMonth : currentMonth;
  const parsedQueries = Number(input?.aiQueries);
  const aiQueries = Number.isInteger(parsedQueries) && parsedQueries >= 0 ? parsedQueries : 0;

  if (usageMonth !== currentMonth) {
    return {
      plan,
      usageMonth: currentMonth,
      aiQueries: 0,
    };
  }

  return {
    plan,
    usageMonth,
    aiQueries,
  };
}

function readState() {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return sanitizeState(JSON.parse(raw));
  } catch (error) {
    console.warn('[subscription] Unable to read subscription state.', error);
    return createDefaultState();
  }
}

function persistState(state) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[subscription] Unable to persist subscription state.', error);
  }
}

export function useSubscription() {
  const [state, setState] = useState(readState);
  const isPro = state.plan === 'Pro';
  const remainingQueries = isPro ? Infinity : Math.max(0, FREE_LIMIT - state.aiQueries);
  const limitReached = !isPro && state.aiQueries >= FREE_LIMIT;

  const consumeAiQuery = useCallback(() => {
    let consumed = false;

    setState((current) => {
      const normalized = sanitizeState(current);

      if (normalized.plan !== 'Pro' && normalized.aiQueries >= FREE_LIMIT) {
        return normalized;
      }

      consumed = true;

      const next = {
        ...normalized,
        aiQueries: normalized.plan === 'Pro' ? normalized.aiQueries : normalized.aiQueries + 1,
      };

      persistState(next);
      return next;
    });

    return consumed;
  }, []);

  return useMemo(
    () => ({
      plan: state.plan,
      isPro,
      aiQueries: state.aiQueries,
      aiLimit: isPro ? Infinity : FREE_LIMIT,
      remainingQueries,
      limitReached,
      consumeAiQuery,
    }),
    [state.plan, state.aiQueries, isPro, remainingQueries, limitReached, consumeAiQuery],
  );
}
