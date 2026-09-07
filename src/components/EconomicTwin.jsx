import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Cpu, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Zap,
  ShoppingBag,
  RefreshCw,
  Percent,
  Play
} from 'lucide-react';

export default function EconomicTwin({ userProfile, onAskCopilot, setActiveTab }) {
  const sueldo = userProfile?.sueldoNeto || 1300000;
  const fijos = (userProfile?.alquiler || 350000) + 
                (userProfile?.expensasServicios || 120000) + 
                (userProfile?.vehiculoGasto || 90000) + 
                (userProfile?.educacionSalud || 85000) + 
                (userProfile?.tarjetaCreditoPromedio || 180000);

  // Default baseline scenario parameters
  const [params, setParams] = useState({
    desvioCanastaMayoristaChino: 70, // % de compras no perecederas mudadas a chino/mayorista
    adopcionSegundasMarcas: 60,      // % sustitución de primeras marcas por equivalentes
    reduccionDeliveryOcio: 45,       // % recorte de gastos hormiga/delivery
    estrategiaCuotasMoneyMarket: 80, // % de cuotas sin interés apalancadas en FCI Money Market
    tasaInflacionEsperadaMes: 3.2,   // % inflación esperada próximo mes
    rendimientoFCI: 2.8              // % mensual rendimiento billetera virtual
  });

  // Calculate counterfactual savings & financial risk impact
  const simulation = useMemo(() => {
    const gastoSupermercadoBase = 320000; // Canasta mensual familiar
    const gastoDeliveryOcioBase = 110000;  // Gastos hormiga y salidas
    const consumoTarjetasBase = 180000;   // Saldo financiable mensual

    // 1. Ahorro por migración a Autoservicio Chino + Mayorista (dispersión promedio 16%)
    const ahorroCanasta = Math.round(
      (gastoSupermercadoBase * (params.desvioCanastaMayoristaChino / 100)) * 0.165
    );

    // 2. Ahorro por sustitución de marcas (diferencial 24% entre primera y segunda marca de calidad homologada)
    const ahorroMarcas = Math.round(
      (gastoSupermercadoBase * (params.adopcionSegundasMarcas / 100)) * 0.238
    );

    // 3. Ahorro por optimización de delivery & salidas
    const ahorroDelivery = Math.round(
      gastoDeliveryOcioBase * (params.reduccionDeliveryOcio / 100)
    );

    // 4. Ganancia financiera por arbitraje de liquidez (Pagar en cuotas sin interés dejando el saldo rindiendo en Money Market)
    const saldoApalancado = consumoTarjetasBase * (params.estrategiaCuotasMoneyMarket / 100);
    const rendimientoFinanciero = Math.round(
      saldoApalancado * ((params.tasaInflacionEsperadaMes + params.rendimientoFCI) / 100)
    );

    const ahorroTotalMensual = ahorroCanasta + ahorroMarcas + ahorroDelivery + rendimientoFinanciero;
    const ahorroTotalAnual = ahorroTotalMensual * 12;

    // Nuevo perfil financiero del Gemelo
    const nuevoDisponible = sueldo - fijos + ahorroTotalMensual;
    const tasaAhorroAnterior = Math.max(0, ((sueldo - fijos - gastoSupermercadoBase - gastoDeliveryOcioBase) / sueldo) * 100);
    const nuevaTasaAhorro = Math.min(45, ((sueldo - fijos - (gastoSupermercadoBase - ahorroCanasta - ahorroMarcas) - (gastoDeliveryOcioBase - ahorroDelivery) + rendimientoFinanciero) / sueldo) * 100);

    // Score de resiliencia financiera (0 a 100)
    const scoreResiliencia = Math.min(96, Math.max(30, Math.round(
      (nuevaTasaAhorro * 1.8) + (params.estrategiaCuotasMoneyMarket * 0.15) + (100 - (fijos / sueldo) * 60)
    )));

    return {
      ahorroCanasta,
      ahorroMarcas,
      ahorroDelivery,
      rendimientoFinanciero,
      ahorroTotalMensual,
      ahorroTotalAnual,
      tasaAhorroAnterior: tasaAhorroAnterior.toFixed(1),
      nuevaTasaAhorro: Math.max(0, nuevaTasaAhorro).toFixed(1),
      scoreResiliencia
    };
  }, [params, sueldo, fijos]);

  const resetParams = () => {
    setParams({
      desvioCanastaMayoristaChino: 70,
      adopcionSegundasMarcas: 60,
      reduccionDeliveryOcio: 45,
      estrategiaCuotasMoneyMarket: 80,
      tasaInflacionEsperadaMes: 3.2,
      rendimientoFCI: 2.8
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <Cpu className="w-4 h-4" />
          <span>Core Tecnológico Exclusivo</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Gemelo Económico Digital (Digital Economic Twin)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              ECONOM-IA crea una réplica computacional de tu economía doméstica. Simula escenarios 
              contrafácticos antes de que gastes un solo peso: evalúa sustitución de canales, marcas y apalancamiento financiero.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetParams}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Restaurar parámetros sugeridos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Calibración Óptima</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Scoreboard: Live Impact of the Twin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ahorro Mensual Simulado
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              $ {simulation.ahorroTotalMensual.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Impacto directo de bolsillo
            </span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">
            Proyectado a 1 año: $ {simulation.ahorroTotalAnual.toLocaleString('es-AR')}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Capacidad de Ahorro
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
              {simulation.nuevaTasaAhorro}%
            </span>
            <span className="text-xs text-slate-500 line-through">
              {simulation.tasaAhorroAnterior}%
            </span>
          </div>
          <div className="text-[10px] text-cyan-300 font-medium">
            +{(simulation.nuevaTasaAhorro - simulation.tasaAhorroAnterior).toFixed(1)}% margen libre recuperado
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Score Resiliencia Financiera
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
              {simulation.scoreResiliencia}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${simulation.scoreResiliencia}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-indigo-950/30">
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
            Acción Inmediata
          </span>
          <p className="text-xs text-slate-300 my-1 leading-snug">
            Aplicar estas 4 decisiones desbloquea <strong className="text-emerald-300 font-mono">$ {simulation.ahorroTotalMensual.toLocaleString('es-AR')}</strong> netos.
          </p>
          <button
            onClick={() => {
              onAskCopilot(`Mi Gemelo Económico Digital calculó que puedo ahorrar $ ${simulation.ahorroTotalMensual.toLocaleString('es-AR')} por mes ($ ${simulation.ahorroCanasta.toLocaleString('es-AR')} en súper, $ ${simulation.ahorroMarcas.toLocaleString('es-AR')} en marcas y $ ${simulation.rendimientoFinanciero.toLocaleString('es-AR')} en rendimiento financiero). ¿Cuál es el paso a paso exacto para implementarlo esta semana en ${userProfile?.barrio || 'mi zona'}?`);
              setActiveTab('chat');
            }}
            className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1 shadow-md shadow-indigo-500/20"
          >
            <span>Ejecutar con el Copiloto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Scenario Sliders */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Simulador de Escenarios Contrafácticos ("¿Qué pasaría si...?")
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajustá las variables de comportamiento para observar cómo reacciona tu Gemelo Económico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Escenario 1: Cambio de Canal (Supermercado -> Chino & Mayorista) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                1. "¿Si compro no perecederos en Chino / Mayorista?"
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                +{simulation.ahorroCanasta.toLocaleString('es-AR')} ARS/mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Desvío de compra a canales de menor margen comercial en alimentos secos, yerba, aceite y limpieza.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={params.desvioCanastaMayoristaChino}
                onChange={(e) => setParams({ ...params, desvioCanastaMayoristaChino: Number(e.target.value) })}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="font-mono text-xs font-bold text-white w-10 text-right">
                {params.desvioCanastaMayoristaChino}%
              </span>
            </div>
          </div>

          {/* Escenario 2: Sustitución de Marcas */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-cyan-400" />
                2. "¿Si cambio de marca a alternativas homologadas?"
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                +{simulation.ahorroMarcas.toLocaleString('es-AR')} ARS/mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sustitución en arroz, harinas, conservas y jabón por segundas marcas con misma fórmula química.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={params.adopcionSegundasMarcas}
                onChange={(e) => setParams({ ...params, adopcionSegundasMarcas: Number(e.target.value) })}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-xs font-bold text-white w-10 text-right">
                {params.adopcionSegundasMarcas}%
              </span>
            </div>
          </div>

          {/* Escenario 3: Racionalización de Delivery y Salidas */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                3. "¿Si optimizo delivery y salidas de fin de semana?"
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                +{simulation.ahorroDelivery.toLocaleString('es-AR')} ARS/mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sustitución de pedidos en apps por rotiserías locales con pago en efectivo o cocina planificada.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={params.reduccionDeliveryOcio}
                onChange={(e) => setParams({ ...params, reduccionDeliveryOcio: Number(e.target.value) })}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="font-mono text-xs font-bold text-white w-10 text-right">
                {params.reduccionDeliveryOcio}%
              </span>
            </div>
          </div>

          {/* Escenario 4: Arbitraje Financiero Cuotas vs Contado en Inflación */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                4. "¿Si financio en cuotas sin interés y rindo liquidez?"
              </span>
              <span className="font-mono font-bold text-purple-400 text-sm">
                +{simulation.rendimientoFinanciero.toLocaleString('es-AR')} ARS/mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pagar bienes durables en cuotas sin interés mientras los pesos generan rendimiento diario en billeteras.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={params.estrategiaCuotasMoneyMarket}
                onChange={(e) => setParams({ ...params, estrategiaCuotasMoneyMarket: Number(e.target.value) })}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <span className="font-mono text-xs font-bold text-white w-10 text-right">
                {params.estrategiaCuotasMoneyMarket}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Card: Desglose Matemático */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h4 className="text-sm font-bold text-white mb-3">
          Desglose Contable del Gemelo Económico
        </h4>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
            <span className="text-slate-300">Ahorro en Alimentos y Limpieza (Chinos + Mayoristas):</span>
            <span className="font-mono font-bold text-emerald-400">+$ {simulation.ahorroCanasta.toLocaleString('es-AR')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
            <span className="text-slate-300">Ahorro por Segundas Marcas Homologadas:</span>
            <span className="font-mono font-bold text-cyan-400">+$ {simulation.ahorroMarcas.toLocaleString('es-AR')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
            <span className="text-slate-300">Ahorro por Reducción de Gastos Hormiga & Delivery:</span>
            <span className="font-mono font-bold text-amber-400">+$ {simulation.ahorroDelivery.toLocaleString('es-AR')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
            <span className="text-slate-300">Rendimiento Financiero Ganado (Apalancamiento de Liquidez):</span>
            <span className="font-mono font-bold text-purple-400">+$ {simulation.rendimientoFinanciero.toLocaleString('es-AR')}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-sm mt-3">
            <span className="font-bold text-emerald-300">Total Neto Disponible Adicional por Mes:</span>
            <span className="font-mono font-extrabold text-emerald-400 text-base">+$ {simulation.ahorroTotalMensual.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
