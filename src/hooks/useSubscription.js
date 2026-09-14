import { useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'economia_subscription';
const FREE_LIMIT = 3;

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function readState() {
  if (typeof window === 'undefined') {
    return { plan: 'Free', usageMonth: getCurrentMonthKey(), aiQueries: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const usageMonth = getCurrentMonthKey();

    if (parsed.usageMonth !== usageMonth) {
      return { plan: parsed.plan === 'Pro' ? 'Pro' : 'Free', usageMonth, aiQueries: 0 };
    }

    return {
      plan: parsed.plan === 'Pro' ? 'Pro' : 'Free',
      usageMonth,
      aiQueries: Number.isInteger(parsed.aiQueries) && parsed.aiQueries >= 0 ? parsed.aiQueries : 0,
    };
  } catch (error) {
    console.warn('[subscription] Unable to read subscription state.', error);
    return { plan: 'Free', usageMonth, aiQueries: 0 };
  }
}

function persistState(state) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useSubscription() {
  const [state, setState] = useState(readState);

  const isPro = state.plan === 'Pro';
  const remainingQueries = isPro ? Infinity : Math.max(0, FREE_LIMIT - state.aiQueries);
  const limitReached = !isPro && state.aiQueries >= FREE_LIMIT;

  const consumeAiQuery = useCallback(() => {
    setState((current) => {
      const normalizedMonth = getCurrentMonthKey();
      const base = current.usageMonth === normalizedMonth
        ? current
        : { ...current, usageMonth: normalizedMonth, aiQueries: 0 };

      if (base.plan !== 'Pro' && base.aiQueries >= FREE_LIMIT) {
        return base;
      }

      const next = {
        ...base,
        aiQueries: base.plan === 'Pro' ? base.aiQueries : base.aiQueries + 1,
      };

      persistState(next);
      return next;
    });

    return isPro || !limitReached;
  }, [isPro, limitReached]);

  const upgradeToPro = useCallback(() => {
    setState((current) => {
      const next = { ...current, plan: 'Pro' };
      persistState(next);
      return next;
    });
  }, []);

  return useMemo(() => ({
    plan: state.plan,
    isPro,
    aiQueries: state.aiQueries,
    aiLimit: isPro ? Infinity : FREE_LIMIT,
    remainingQueries,
    limitReached,
    consumeAiQuery,
    upgradeToPro,
  }), [state.plan, state.aiQueries, isPro, remainingQueries, limitReached, consumeAiQuery, upgradeToPro]);
}

export { FREE_LIMIT };
