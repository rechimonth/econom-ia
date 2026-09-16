import { useCallback, useEffect, useState } from 'react';
import { getSupabaseClient } from '../services/supabase/client';

export const FREE_LIMIT = 3;
export const PRO_LIMIT = 1000;

function getMeEndpoint() {
  const configured = import.meta.env.VITE_AI_API_URL || '/api/ai';
  return configured.replace(/\/ai\/?$/, '/me');
}

export function useSubscription() {
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setQuota(null);
        return;
      }

      const response = await fetch(getMeEndpoint(), {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.status === 401) {
        setQuota(null);
        return;
      }

      if (!response.ok) {
        console.warn('[subscription] Quota endpoint returned', response.status);
        return;
      }

      const nextQuota = await response.json();
      const billing = nextQuota?.billing;

      if (
        !nextQuota ||
        !['Free', 'Pro'].includes(nextQuota.plan) ||
        !Number.isInteger(nextQuota.used) ||
        nextQuota.used < 0 ||
        !Number.isInteger(nextQuota.limit) ||
        nextQuota.limit <= 0 ||
        !Number.isInteger(nextQuota.remaining) ||
        nextQuota.remaining < 0 ||
        !billing ||
        typeof billing.cancelAtPeriodEnd !== 'boolean'
      ) {
        console.warn('[subscription] Invalid quota/billing payload received.');
        return;
      }

      setQuota(nextQuota);
    } catch (error) {
      console.warn('[subscription] No se pudo leer la cuota y billing.', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  useEffect(() => {
    const onQuotaChanged = () => refresh();
    window.addEventListener('economia:quota-changed', onQuotaChanged);
    return () => window.removeEventListener('economia:quota-changed', onQuotaChanged);
  }, [refresh]);

  const isPro = quota?.plan === 'Pro';
  const remainingQueries = quota?.remaining ?? FREE_LIMIT;
  const limitReached = Boolean(quota) && remainingQueries <= 0;

  return {
    loading,
    plan: quota?.plan ?? 'Free',
    isPro,
    aiQueries: quota?.used ?? 0,
    aiLimit: quota?.limit ?? FREE_LIMIT,
    remainingQueries,
    limitReached,
    billing: quota?.billing ?? null,
    refresh,
  };
}
