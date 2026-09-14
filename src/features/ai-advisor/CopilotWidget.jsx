import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Mic, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  ShoppingBag, 
  Receipt, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  Volume2
} from 'lucide-react';

export default function CopilotWidget({ 
  userProfile, 
  setActiveTab, 
  onAskCopilot,
  recentTickets = [] 
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [todayExpense, setTodayExpense] = useState(3200);

  const sueldo = userProfile.sueldoNeto || 1300000;
  const gastosFijos = (userProfile.alquiler || 350000) + 
                      (userProfile.expensasServicios || 120000) + 
                      (userProfile.vehiculoGasto || 90000) + 
                      (userProfile.educacionSalud || 85000) + 
                      (userProfile.tarjetaCreditoPromedio || 180000);
  const fixedRatio = Math.round((gastosFijos / (sueldo + (userProfile.ingresosExtra || 0))) * 100);

  const handleSimulateVoice = () => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      onAskCopilot("¿Dónde consigo azúcar más barata cerca de mi zona?");
      setActiveTab('chat');
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Copilot Morning Greeting Card (From User Spec) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 border border-sky-500/20 p-5 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-sky-400">Modo Copiloto Activo</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-lg font-bold text-white">Buen día, {userProfile.name.split(' ')[0]} ☀️</h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            <Calendar className="w-3 h-3 text-sky-400" />
            {new Date().toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Morning Briefing stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-slate-950/60 backdrop-blur rounded-xl p-3 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Gastaste ayer</span>
            <div className="text-lg font-bold font-mono text-slate-200">
              $ 6.300 <span className="text-xs font-normal text-slate-400">ARS</span>
            </div>
            <span className="text-[11px] text-slate-500">Supermercado de cercanía</span>
          </div>

          <div className="bg-slate-950/60 backdrop-blur rounded-xl p-3 border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-xs text-emerald-400 block mb-1">Podrías ahorrar hoy</span>
            <div className="text-lg font-bold font-mono text-emerald-300">
              $ 1.800 <span className="text-xs font-normal text-emerald-500">ARS</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Dividiendo compra en 2 locales</span>
          </div>

          <div className="bg-slate-950/60 backdrop-blur rounded-xl p-3 border border-amber-500/30 bg-amber-950/10">
            <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Aumentos detectados</span>
            </div>
            <div className="text-sm font-semibold text-amber-200">
              Aceite (+6,8%), Yerba (+4,2%)
            </div>
            <span className="text-[11px] text-slate-400">Revisados en 14 góndolas hoy</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <p className="text-slate-300 flex items-center gap-1.5">
            <span className="text-sky-400 font-semibold">📍 Zona actual:</span> {userProfile.barrio || userProfile.ciudad} (Canasta básica $ 72.000)
          </p>
          <button
            onClick={() => {
              onAskCopilot("Haceme un resumen de mis finanzas de esta semana y dónde recortar gastos.");
              setActiveTab('chat');
            }}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
          >
            <span>Ver análisis completo</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* The Smart Widget Component (Spec: 💰 Gastaste hoy, 📈 Inflación personal, 🛒 Ahorro disponible, 🎤 Hablar con IA) */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-cyan-500/30 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Widget Inteligente de Pantalla
            </span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            En vivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Item 1: Gastaste hoy */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>💰</span> Gastaste hoy:
              </span>
              <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                $ {todayExpense.toLocaleString('es-AR')}
              </div>
            </div>
            <button
              onClick={() => setTodayExpense(prev => prev + 1500)}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition"
              title="Registrar gasto rápido"
            >
              + Gasto
            </button>
          </div>

          {/* Item 2: Inflación personal */}
          <div 
            onClick={() => setActiveTab('inflacion')}
            className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/50 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-amber-300 flex items-center gap-1">
                <span>📈</span> Inflación personal:
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-amber-400">4,8%</span>
                <span className="text-[10px] text-slate-400 line-through">Oficial 2,3%</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          {/* Item 3: Ahorro disponible */}
          <div 
            onClick={() => setActiveTab('precios')}
            className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400/50 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-emerald-300 flex items-center gap-1">
                <span>🛒</span> Ahorro disponible:
              </span>
              <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
                $ 7.400
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Voice Action Button */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            Preguntale cualquier duda de precios, tickets o finanzas a tu copiloto.
          </p>
          <button
            onClick={handleSimulateVoice}
            disabled={isSpeaking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition"
          >
            <Mic className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-red-700' : ''}`} />
            <span>{isSpeaking ? 'Escuchando consulta...' : '🎤 Hablar con IA'}</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary (MVP Módulo 2: Perfil económico) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fixed Expenses Ratio Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              Gastos Fijos del Hogar
            </span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
              fixedRatio <= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {fixedRatio}% del sueldo
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
            <div 
              className={`h-full rounded-full ${
                fixedRatio <= 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-400'
              }`}
              style={{ width: `${Math.min(fixedRatio, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Ingresos totales</span>
              <span className="font-mono font-bold text-slate-200">
                $ {(sueldo + (userProfile.ingresosExtra || 0)).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Fijos (Alquiler + Serv)</span>
              <span className="font-mono font-bold text-slate-200">
                $ {gastosFijos.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5">
            Según tu perfil en {userProfile.ciudad}, tu ratio del {fixedRatio}% está dentro del rango {fixedRatio <= 50 ? 'ideal' : 'ajustado'}.
          </p>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Acciones de Alto Impacto
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('tickets')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition group"
              >
                <Receipt className="w-4 h-4 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-white block">Escanear Ticket</span>
                <span className="text-[10px] text-slate-400">OCR automático</span>
              </button>

              <button
                onClick={() => setActiveTab('precios')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-white block">Comparar Góndola</span>
                <span className="text-[10px] text-slate-400">Chino vs Mayorista</span>
              </button>

              <button
                onClick={() => setActiveTab('comunidad')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition group"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-white block">Waze de Precios</span>
                <span className="text-[10px] text-slate-400">Reportes colaborativos</span>
              </button>

              <button
                onClick={() => setActiveTab('mapa')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition group"
              >
                <TrendingDown className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-white block">Mapa de Ahorro</span>
                <span className="text-[10px] text-slate-400">Lanús vs Monte Chingolo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
