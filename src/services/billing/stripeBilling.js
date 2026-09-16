import { getSupabaseClient } from '../supabase/client';

function getBillingEndpoint(path) {
  const base = import.meta.env.VITE_AI_API_URL || '/api/ai';
  const apiRoot = base.replace(/\/ai\/?$/, '');
  return `${apiRoot}/billing/${path}`;
}

async function authenticatedBillingRequest(path) {
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    const error = new Error('AUTH_REQUIRED');
    error.code = 'AUTH_REQUIRED';
    error.status = 401;
    throw error;
  }

  const response = await fetch(getBillingEndpoint(path), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Billing request failed with status ${response.status}.`);
    error.code = data?.error || 'BILLING_REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function startProCheckout() {
  const data = await authenticatedBillingRequest('checkout');
  if (!data?.url) throw new Error('CHECKOUT_URL_MISSING');
  window.location.assign(data.url);
}

export async function openBillingPortal() {
  const data = await authenticatedBillingRequest('portal');
  if (!data?.url) throw new Error('PORTAL_URL_MISSING');
  window.location.assign(data.url);
}

export async function cancelProSubscription() {
  return authenticatedBillingRequest('cancel');
}

export async function resumeProSubscription() {
  return authenticatedBillingRequest('resume');
}
