const DEFAULT_AI_ENDPOINT = '/api/ai';

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function buildFinancialSummary(userProfile) {
  const sueldo = toFiniteNumber(userProfile?.sueldoNeto);
  const extras = toFiniteNumber(userProfile?.ingresosExtra);
  const income = Math.max(0, sueldo + extras);

  const expenses = Math.max(
    0,
    toFiniteNumber(userProfile?.alquiler) +
      toFiniteNumber(userProfile?.expensasServicios) +
      toFiniteNumber(userProfile?.vehiculoGasto) +
      toFiniteNumber(userProfile?.educacionSalud) +
      toFiniteNumber(userProfile?.tarjetaCreditoPromedio) +
      toFiniteNumber(userProfile?.gastoSupermercadoMensual),
  );

  return {
    income,
    expenses,
  };
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
          text: text.slice(0, 4000),
        }))
    : [];
}

function getAiEndpoint() {
  return import.meta.env.VITE_AI_API_URL || DEFAULT_AI_ENDPOINT;
}

async function requestBackendAi({ prompt, financialSummary, chatHistory }) {
  const endpoint = getAiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      prompt: prompt.slice(0, 4000),
      financialSummary,
      chatHistory: sanitizeChatHistory(chatHistory),
    }),
  });

  if (!response.ok) {
    const error = new Error(`AI backend request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data?.text || data?.message || data?.answer;

  if (!text || typeof text !== 'string') {
    throw new Error('AI backend returned an invalid response');
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
    throw new Error('AI prompt is required.');
  }

  const financialSummary = buildFinancialSummary(userProfile);

  return requestBackendAi({
    prompt: normalizedPrompt,
    financialSummary,
    chatHistory,
  });
}
