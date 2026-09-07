import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  ShoppingBag, 
  Home, 
  Car, 
  HeartPulse, 
  Sliders, 
  Info,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { INFLATION_BENCHMARK } from '../data/mockData';

export default function InflationCalculator({ userProfile, onAskCopilot, setActiveTab }) {
  // User customized weights of monthly spending
  const [weights, setWeights] = useState({
    alimentos: 42,
    vivienda: 28,
    transporte: 14,
    salud: 12,
    otros: 4
  });

  // Category specific real price increase rates observed in retail
  const categoryInflation = {
    alimentos: 5.6, // Higher increase in pantry staples
    vivienda: 4.8,  // Tariffs, expensas, rentals
    transporte: 3.5,// Fuel & public transport
    salud: 3.2,     // Prepaga / pharmacy
    otros: 1.8      // Clothes & electronics with discounts
  };

  const oficialINDEC = INFLATION_BENCHMARK.oficialMensual; // 2.3%

  // Calculate weighted personal pocket inflation
  const personalInflation = useMemo(() => {
    const totalWeight = weights.alimentos + weights.vivienda + weights.transporte + weights.salud + weights.otros;
    if (totalWeight === 0) return oficialINDEC;
    
    const weightedSum = 
      (weights.alimentos * categoryInflation.alimentos) +
      (weights.vivienda * categoryInflation.vivienda) +
      (weights.transporte * categoryInflation.transporte) +
      (weights.salud * categoryInflation.salud) +
      (weights.otros * categoryInflation.otros);

    return Number((weightedSum / totalWeight).toFixed(1));
  }, [weights]);

  // Extra cost in ARS based on user's monthly spending
  const monthlySpending = (userProfile.sueldoNeto || 1300000) * 0.85; // Active consumption budget
  const costImpactOficial = Math.round(monthlySpending * (oficialINDEC / 100));
  const costImpactPersonal = Math.round(monthlySpending * (personalInflation / 100));
  const breachPesos = costImpactPersonal - costImpactOficial;

  const updateWeight = (category, value) => {
    setWeights(prev => ({
      ...prev,
      [category]: Math.max(0, Math.min(100, Number(value)))
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>La Joya de ECONOM-IA</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Calculadora de Inflación de Mi Bolsillo
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          El INDEC mide una canasta teórica promedio que incluye turismo, electrónica e indumentaria. 
          Tu bolsillo real siente el aumento directo en el supermercado, las tarifas y la nafta.
        </p>
      </div>

      {/* Hero Comparative Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Official INDEC Box */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Inflación Oficial (INDEC)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                Promedio nacional
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-slate-300">
                {oficialINDEC}%
              </span>
              <span className="text-xs text-slate-500">mensual</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Pondera indumentaria, recreación y bienes durables que se mantuvieron estables.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>Impacto en tu presupuesto:</span>
            <span className="font-mono font-bold text-slate-300">+ $ {costImpactOficial.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* Real Pocket Inflation Box (Highlight) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border-2 border-amber-500/50 p-5 shadow-lg shadow-amber-500/10 flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Tu Inflación de Bolsillo
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Basada en tu consumo real
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400">
                {personalInflation}%
              </span>
              <div className="text-xs font-semibold text-rose-400 flex items-center">
                <span>+{(personalInflation - oficialINDEC).toFixed(1)}% vs oficial</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2">
              Sensibilidad alta por mayor peso en alimentos esenciales y servicios fijos del conurbano/CABA.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Impacto real en pesos:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              + $ {costImpactPersonal.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      {/* Gap Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Brecha de bolsillo detectada</h4>
            <p className="text-xs text-slate-400">
              Necesitás <span className="font-bold text-rose-400 font-mono">$ {breachPesos.toLocaleString('es-AR')}</span> más de lo que indica el índice oficial para no perder poder adquisitivo.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onAskCopilot(`Mi inflación de bolsillo es ${personalInflation}% contra ${oficialINDEC}% del INDEC. ¿Cómo hago para compensar los $ ${breachPesos.toLocaleString('es-AR')} que me faltan?`);
            setActiveTab('chat');
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold whitespace-nowrap transition flex items-center justify-center gap-1.5"
        >
          <span>Preguntar estrategia a IA</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Spending Distribution Sliders */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Ajustá la distribución real de tus gastos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Moveé los porcentajes según cómo distribuís tus compras cada mes para recalcular tu índice exacto.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Rubro 1: Alimentos y Bebidas */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                Alimentos y Bebidas
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[11px] text-slate-400">Aumento rubro: <strong className="text-rose-400">+{categoryInflation.alimentos}%</strong></span>
                <span className="font-bold text-emerald-400 w-12 text-right">{weights.alimentos}%</span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={weights.alimentos}
              onChange={(e) => updateWeight('alimentos', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Rubro 2: Alquiler, Expensas y Servicios */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-sky-400" />
                Vivienda, Alquiler y Tarifas (Luz/Gas/Agua)
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[11px] text-slate-400">Aumento rubro: <strong className="text-rose-400">+{categoryInflation.vivienda}%</strong></span>
                <span className="font-bold text-sky-400 w-12 text-right">{weights.vivienda}%</span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.vivienda}
              onChange={(e) => updateWeight('vivienda', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Rubro 3: Transporte y Combustible */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                Transporte, Nafta y Seguro
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[11px] text-slate-400">Aumento rubro: <strong className="text-rose-400">+{categoryInflation.transporte}%</strong></span>
                <span className="font-bold text-amber-400 w-12 text-right">{weights.transporte}%</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weights.transporte}
              onChange={(e) => updateWeight('transporte', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Rubro 4: Salud y Educación */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Salud, Prepaga y Educación
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[11px] text-slate-400">Aumento rubro: <strong className="text-rose-400">+{categoryInflation.salud}%</strong></span>
                <span className="font-bold text-rose-400 w-12 text-right">{weights.salud}%</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={weights.salud}
              onChange={(e) => updateWeight('salud', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
