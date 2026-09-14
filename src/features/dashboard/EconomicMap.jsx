import React, { useState } from 'react';
import { 
  MapPin, 
  TrendingDown, 
  Navigation, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  ArrowRight,
  Compass,
  Layers
} from 'lucide-react';
import { ARGENTINE_ZONES } from '../data/mockData';

export default function EconomicMap({ userProfile, onAskCopilot, setActiveTab }) {
  const [selectedZoneId, setSelectedZoneId] = useState('monte_chingolo');

  const selectedZone = ARGENTINE_ZONES.find(z => z.id === selectedZoneId) || ARGENTINE_ZONES[0];

  const growthPhases = [
    { fase: "Fase 1", lugar: "Monte Chingolo", status: "Activo (Cobertura 100%)", badge: "Comenzó acá" },
    { fase: "Fase 2", lugar: "Lanús", status: "Activo (85% comercios)", badge: "En expansión" },
    { fase: "Fase 3", lugar: "Conurbano Sur & Oeste", status: "Relevando datos", badge: "Próximo" },
    { fase: "Fase 4", lugar: "Buenos Aires (AMBA)", status: "Próximamente", badge: "Q4" },
    { fase: "Fase 5", lugar: "Toda Argentina", status: "Roadmap", badge: "Objetivo" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/20 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
          <Compass className="w-4 h-4" />
          <span>Funcionalidad Diferencial</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Mapa Económico de Ahorro Territorial
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          No es un mapa tradicional de negocios: es un mapa de ahorro. 
          Te muestra en qué zonas y barrios la misma canasta básica cuesta hasta 18% menos gracias a la dispersión de precios.
        </p>
      </div>

      {/* Interactive Savings Benchmark Card (Exact Spec: Monte Chingolo $72.000 vs Lanús $79.000 = Ahorro 11%) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-2 border-cyan-500/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Zona Seleccionada
            </span>
            <h3 className="text-2xl font-black text-white mt-0.5">
              {selectedZone.nombre}
            </h3>
            <span className="text-xs text-slate-400">Partido de {selectedZone.partido}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Canasta básica zona:</span>
              <span className="font-mono font-extrabold text-white text-lg">
                $ {selectedZone.canastaBasica.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Promedio {selectedZone.partido}:</span>
              <span className="font-mono font-semibold text-slate-300 text-lg">
                $ {selectedZone.promedioZona.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/40">
              <span className="text-[10px] text-emerald-300 block font-bold">Ahorro territorial:</span>
              <span className="font-mono font-black text-emerald-400 text-xl">
                {selectedZone.ahorroPorcentaje > 0 ? `+${selectedZone.ahorroPorcentaje}%` : `${selectedZone.ahorroPorcentaje}%`}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
          💡 <strong className="text-white">Insight del Copiloto:</strong> {selectedZone.destacado}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Comercios relevados en la zona: <strong>28 puntos (19 chinos, 6 supermercados, 3 mayoristas)</strong>
          </span>
          <button
            onClick={() => {
              onAskCopilot(`¿Qué supermercados y chinos me conviene visitar en ${selectedZone.nombre} para conseguir la canasta de $ ${selectedZone.canastaBasica.toLocaleString('es-AR')}?`);
              setActiveTab('chat');
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>Ver comercios recomendados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone Selector Pills */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          Comparar con Otros Barrios del AMBA
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARGENTINE_ZONES.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-white">{zone.nombre}</h5>
                    <span className="text-xs text-slate-400">{zone.partido}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    zone.ahorroPorcentaje > 5 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : zone.ahorroPorcentaje >= 0 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {zone.ahorroPorcentaje > 0 ? `${zone.ahorroPorcentaje}% ahorro` : `${zone.ahorroPorcentaje}% más caro`}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs font-mono">
                  <span className="text-slate-400 font-sans">Canasta Básica:</span>
                  <span className="font-bold text-slate-200">$ {zone.canastaBasica.toLocaleString('es-AR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estrategia de Crecimiento (From Prompt Specification) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          Estrategia de Crecimiento & Expansión Territorial
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Dominando primero la granularidad del conurbano donde la dispersión de precios es máxima.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {growthPhases.map((phase, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs ${
                idx === 0 
                  ? 'bg-cyan-950/30 border-cyan-500/40' 
                  : idx === 1 
                  ? 'bg-emerald-950/30 border-emerald-500/40' 
                  : 'bg-slate-950 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold uppercase tracking-wider text-slate-400">{phase.fase}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                  {phase.badge}
                </span>
              </div>
              <h5 className="font-bold text-white text-xs">{phase.lugar}</h5>
              <p className="text-[10px] text-slate-400 mt-1">{phase.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
