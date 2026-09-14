const DEFAULT_AI_ENDPOINT = '/api/ai';

function buildEconomicContext({ userProfile, productsCatalog, recentTickets, inflationData }) {
  const sueldo = userProfile?.sueldoNeto || 1300000;
  const extras = userProfile?.ingresosExtra || 0;
  const ingresosTotales = sueldo + extras;
  const gastosFijos = (userProfile?.alquiler || 350000) +
    (userProfile?.expensasServicios || 120000) +
    (userProfile?.vehiculoGasto || 90000) +
    (userProfile?.educacionSalud || 85000) +
    (userProfile?.tarjetaCreditoPromedio || 180000);

  return {
    sueldo,
    extras,
    ingresosTotales,
    gastosFijos,
    porcentajeFijos: Math.round((gastosFijos / ingresosTotales) * 100),
    margenAhorro: ingresosTotales - gastosFijos - (userProfile?.gastoSupermercadoMensual || 280000),
    zona: userProfile?.barrio || 'Monte Chingolo',
    partido: userProfile?.ciudad || 'Lanús',
    userProfile,
    productsCatalog,
    recentTickets,
    inflationData
  };
}

function getAiEndpoint() {
  // Only a non-sensitive endpoint is exposed to the frontend.
  // Secrets must live in the future backend, never in VITE_* variables.
  return import.meta.env.VITE_AI_API_URL || DEFAULT_AI_ENDPOINT;
}

async function requestBackendAi({ prompt, context, chatHistory }) {
  const endpoint = getAiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      context,
      chatHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI backend request failed with status ${response.status}`);
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
  productsCatalog,
  recentTickets,
  inflationData,
  chatHistory = [],
}) {
  const context = buildEconomicContext({
    userProfile,
    productsCatalog,
    recentTickets,
    inflationData,
  });

  try {
    return await requestBackendAi({ prompt, context, chatHistory });
  } catch (error) {
    console.warn('[ai] Backend unavailable; using local fallback engine.', error);
    return generateLocalCopilotResponse(prompt, context);
  }
}

function generateLocalCopilotResponse(prompt, ctx) {
  const lower = prompt.toLowerCase();

  if (lower.includes('gano') || lower.includes('gastando demasiado') || lower.includes('alcanza') || lower.includes('sueldo') || lower.includes('porcentaje')) {
    return `📊 **Diagnóstico de tu bolsillo**:\n\nActualmente con ingresos de **$ ${ctx.ingresosTotales.toLocaleString('es-AR')}**, estás destinando aproximadamente el **${ctx.porcentajeFijos}% a gastos fijos** ($ ${ctx.gastosFijos.toLocaleString('es-AR')}).\n\n💡 **Tu estado financiero**:\n- Tu ratio del **${ctx.porcentajeFijos}%** necesita seguimiento según tu estructura de gastos.\n- Te queda un margen estimado de **$ ${Math.max(0, ctx.margenAhorro).toLocaleString('es-AR')}** después de gastos fijos y supermercado.\n\n🎯 **Consejo del Copiloto**:\nRevisá los gastos con tarjeta de crédito ($ ${ctx.userProfile?.tarjetaCreditoPromedio?.toLocaleString('es-AR') || '0'}).`;
  }

  if (lower.includes('dónde compro') || lower.includes('mas barata') || lower.includes('más barata') || lower.includes('compra mensual') || lower.includes('supermercado')) {
    return `🛒 **Estrategia de compra para ${ctx.zona} (${ctx.partido})**:\n\nCompará precios por producto y priorizá mayoristas o comercios de cercanía cuando el ahorro sea material. Usá la Lista Inteligente de ECONOM-IA para calcular el total combinado antes de comprar.`;
  }

  if (lower.includes('inflacion') || lower.includes('inflación') || lower.includes('bolsillo') || lower.includes('indec')) {
    return `📈 **Inflación de bolsillo**:\n\nTu inflación personal depende de cómo se distribuyen tus gastos. ECONOM-IA puede contrastar tus movimientos y tickets con los datos disponibles para detectar dónde está el mayor impacto en tu presupuesto.`;
  }

  if (lower.includes('cuota') || lower.includes('contado') || lower.includes('tarjeta') || lower.includes('interés') || lower.includes('interes')) {
    return `💳 **Cuotas vs. contado**:\n\nCompará el precio final, el CFT y el descuento por contado. No decidas solo por la cantidad de cuotas: el costo total es la referencia correcta.`;
  }

  if (lower.includes('chino') || lower.includes('chinos') || lower.includes('autoservicio') || lower.includes('barrio') || lower.includes('confiabilidad')) {
    return `🏮 **Comercio de cercanía**:\n\nUsá la comparación por producto para decidir qué conviene comprar en un autoservicio barrial y qué conviene comprar en un mayorista.`;
  }

  return `🤖 **ECONOM-IA Copiloto responde**:\n\nAnalicé tu consulta considerando tu perfil en **${ctx.zona}**. Registrá tus ingresos y gastos en Movimientos para que el análisis financiero futuro pueda partir de datos propios y no solo de estimaciones.`;
}
