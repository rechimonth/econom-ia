import { getSupabaseClient } from '../supabase/client';

const DEFAULT_AI_ENDPOINT = '/api/ai';

export class AiApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = 'AiApiError';
    this.code = code;
    this.status = status;
  }
}

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function buildFinancialSummary(userProfile) {
  const income = Math.max(
    0,
    toFiniteNumber(userProfile?.sueldoNeto) +
      toFiniteNumber(userProfile?.ingresosExtra),
  );

  const expenses = Math.max(
    0,
    toFiniteNumber(userProfile?.alquiler) +
      toFiniteNumber(userProfile?.expensasServicios) +
      toFiniteNumber(userProfile?.vehiculoGasto) +
      toFiniteNumber(userProfile?.educacionSalud) +
      toFiniteNumber(userProfile?.tarjetaCreditoPromedio) +
      toFiniteNumber(userProfile?.gastoSupermercadoMensual),
  );

  return { income, expenses };
}

function sanitizeChatHistory(chatHistory) {
  return Array.isArray(chatHistory)
    ? chatHistory
        .filter(
          (message) =>
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.text === 'string',
        )
        .slice(-12)
        .map(({ role, text }) => ({
          role,
          text: text.slice(0, 2000),
        }))
    : [];
}

function getAiEndpoint() {
  return import.meta.env.VITE_AI_API_URL || DEFAULT_AI_ENDPOINT;
}

async function handleAuthenticationFailure(supabase, code, message, status) {
  try {
    await supabase.auth.signOut();
  } catch (signOutError) {
    console.warn('[ai] Unable to clear expired Supabase session.', signOutError);
  }

  window.dispatchEvent(
    new CustomEvent('economia:auth-required', {
      detail: { code, message, status },
    }),
  );

  throw new AiApiError(code, message, status);
}

async function requestBackendAi({ prompt, financialSummary, chatHistory }) {
  let supabase;

  try {
    supabase = getSupabaseClient();
  } catch {
    throw new AiApiError(
      'SUPABASE_AUTH_NOT_CONFIGURED',
      'Supabase Auth is not configured.',
      503,
    );
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return handleAuthenticationFailure(
      supabase,
      'AUTH_REQUIRED',
      'Your session is missing or expired.',
      401,
    );
  }

  const response = await fetch(getAiEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      prompt: prompt.slice(0, 4000),
      financialSummary,
      chatHistory: sanitizeChatHistory(chatHistory),
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    return handleAuthenticationFailure(
      supabase,
      data?.error || 'AUTH_INVALID',
      data?.message || 'Your session is invalid or expired.',
      401,
    );
  }

  if (response.status === 403 && data?.error === 'AI_QUOTA_EXCEEDED') {
    window.dispatchEvent(
      new CustomEvent('economia:upgrade-required', {
        detail: { code: 'AI_QUOTA_EXCEEDED', status: 403 },
      }),
    );

    throw new AiApiError(
      'AI_QUOTA_EXCEEDED',
      'The monthly AI quota has been reached.',
      403,
    );
  }

  if (!response.ok) {
    throw new AiApiError(
      data?.error || 'AI_REQUEST_FAILED',
      data?.message || `AI backend request failed with status ${response.status}.`,
      response.status,
    );
  }

  const text = data?.text || data?.message || data?.answer;

  if (!text || typeof text !== 'string') {
    throw new AiApiError(
      'INVALID_AI_RESPONSE',
      'AI backend returned an invalid response.',
      502,
    );
  }

  return text;
}

export async function askEconomicCopilot({
  prompt,
  userProfile,
  chatHistory = [],
}) {
  const normalizedPrompt = String(prompt ?? '').trim();

  if (!normalizedPrompt) {
    throw new AiApiError('INVALID_PROMPT', 'AI prompt is required.', 400);
  }

  const financialSummary = buildFinancialSummary(userProfile);

  return requestBackendAi({
    prompt: normalizedPrompt,
    financialSummary,
    chatHistory,
  });
}
