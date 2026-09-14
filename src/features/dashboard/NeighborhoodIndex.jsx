import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Bell, 
  ArrowRight,
  Store,
  Calendar,
  Sparkles,
  Share2
} from 'lucide-react';

export default function NeighborhoodIndex({ isRetireeMode = false }) {
  const [selectedZone, setSelectedZone] = useState('monte_chingolo');

  const ZONES = {
    monte_chingolo: {
      name: 'Monte Chingolo (Lanús)',
      score: 78,
      canastaActual: 94300,
      canastaAnterior: 93000,
      variacionSemanal: 1.4,
      comercioMasBarato: 'Supermercado Chen (Av. Eva Perón)',
      ahorroPromedioVsCadenas: 18.5,
      actualizadoHace: 'hace 4 horas',
      productosRelevados: 35
    },
    lanus_centro: {
      name: 'Lanús Oeste / Centro',
      score: 72,
      canastaActual: 104200,
      canastaAnterior: 102400,
      variacionSemanal: 1.8,
      comercioMasBarato: 'Autoservicio Luna (calle Lynch)',
      ahorroPromedioVsCadenas: 14.2,
      actualizadoHace: 'hace 2 horas',
      productosRelevados: 42
    },
    remedios_escalada: {
      name: 'Remedios de Escalada',
      score: 75,
      canastaActual: 98600,
      canastaAnterior: 97100,
      variacionSemanal: 1.5,
      comercioMasBarato: 'El Trébol (calle Beltrán)',
      ahorroPromedioVsCadenas: 16.0,
      actualizadoHace: 'hace 6 horas',
      productosRelevados: 30
    }
  };

  const OPPORTUNITIES = [
    {
      id: 1,
      producto: 'Yerba Mate Playadito 1kg',
      comercio: 'Autoservicio Chen (Monte Chingolo)',
      precioHabitual: 5200,
      precioDetectado: 4100,
      descuento: 21,
      ahorroPesos: 1100,
      vigencia: 'Hasta agotar stock de 40 paquetes',
      categoria: 'Almacén'
    },
    {
      id: 2,
      producto: 'Aceite Girasol Natura 1.5L',
      comercio: 'Supermercado Luna (calle Lynch)',
      precioHabitual: 3300,
      precioDetectado: 2650,
      descuento: 20,
      ahorroPesos: 650,
      vigencia: 'Precio verificado hoy',
      categoria: 'Almacén'
    },
    {
      id: 3,
      producto: 'Jabón Líquido Ala Lavado Total 3L',
      comercio: 'Mayorista Maxiconsumo (Camino Negro)',
      precioHabitual: 11500,
      precioDetectado: 8900,
      descuento: 23,
      ahorroPesos: 2600,
      vigencia: 'Comprando 2 unidades',
      categoria: 'Limpieza'
    },
    {
      id: 4,
      producto: 'Fideos Matarazzo Guiseros 500g',
      comercio: 'Autoservicio Chen',
      precioHabitual: 1850,
      precioDetectado: 1450,
      descuento: 22,
      ahorroPesos: 400,
      vigencia: 'Precio especial en efectivo/QR',
      categoria: 'Almacén'
    }
  ];

  const currentZone = ZONES[selectedZone];

  return (
    <div className={`space-y-6 ${isRetireeMode ? 'text-lg' : ''}`}>
      {/* Métrica Principal Hero: Ahorro Generado por la Comunidad */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/70 border border-emerald-500/40 p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Métrica Principal de Impacto Colectivo</span>
            </div>
            <span className={`${isRetireeMode ? 'text-3xl sm:text-5xl' : 'text-3xl sm:text-4xl'} font-black font-mono text-emerald-400 tracking-tight block`}>
              $ 874.320.450
            </span>
            <p className={`${isRetireeMode ? 'text-base' : 'text-xs sm:text-sm'} text-slate-300 mt-1`}>
              Pesos ahorrados acumulados por las familias argentinas evitando pagar de más en cada compra semanal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tu Ahorro Estimado Este Mes</span>
            <span className="text-xl font-bold font-mono text-white block mt-0.5">$ 38.600 ARS</span>
            <span className="text-[11px] text-emerald-400 font-medium">9 compras optimizadas</span>
          </div>
        </div>
      </div>

      {/* 1. ÍNDICE ECONÓMICO BARRIAL (IEB) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>Termómetro de Precios de Barrio</span>
            </div>
            <h3 className={`${isRetireeMode ? 'text-2xl' : 'text-xl'} font-black text-white`}>
              Índice Económico Barrial (IEB)
            </h3>
            <p className={`${isRetireeMode ? 'text-sm' : 'text-xs'} text-slate-400 mt-0.5`}>
              Mide cuán caro o barato es comprar hoy en tu zona frente al promedio de Buenos Aires.
            </p>
          </div>

          {/* Selector de Barrio */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="monte_chingolo">Monte Chingolo (Lanús)</option>
              <option value="lanus_centro">Lanús Oeste / Centro</option>
              <option value="remedios_escalada">Remedios de Escalada</option>
            </select>
          </div>
        </div>

        {/* Ficha del IEB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Puntaje */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Índice Económico</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-400">
                {currentZone.score}
              </span>
              <span className="text-sm font-bold text-slate-500">/ 100</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Zona con alta conveniencia
            </span>
          </div>

          {/* Canasta Barrial */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Canasta Básica 35 Ítems</span>
            <div className="my-2">
              <span className="text-2xl font-black font-mono text-white block">
                $ {currentZone.canastaActual.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{currentZone.variacionSemanal}% esta semana</span>
            </div>
          </div>

          {/* Comercio Más Barato */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Comercio Más Barato Detectado</span>
            <div className="my-2 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-base font-bold text-white">
                {currentZone.comercioMasBarato}
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-medium block">
              Permite ahorrar hasta {currentZone.ahorroPromedioVsCadenas}% frente a las grandes cadenas.
            </span>
          </div>
        </div>
      </div>

      {/* 2. RADAR DE OPORTUNIDADES */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Alertas en Vivo de Precios Caídos</span>
            </div>
            <h3 className={`${isRetireeMode ? 'text-2xl' : 'text-xl'} font-black text-white`}>
              Radar de Oportunidades
            </h3>
            <p className={`${isRetireeMode ? 'text-sm' : 'text-xs'} text-slate-400 mt-0.5`}>
              Caídas abruptas de precio detectadas en los comercios de tu barrio esta semana.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OPPORTUNITIES.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`block font-bold ${isRetireeMode ? 'text-lg' : 'text-sm'} text-white`}>
                    {opp.producto}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    {opp.comercio}
                  </span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black shrink-0">
                  -{opp.descuento}%
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-slate-900">
                <div>
                  <span className="text-[11px] text-slate-500 line-through mr-2">
                    Habitual: $ {opp.precioHabitual.toLocaleString('es-AR')}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    $ {opp.precioDetectado.toLocaleString('es-AR')}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  Ahorrás $ {opp.ahorroPesos.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg flex items-center justify-between">
                <span>{opp.vigencia}</span>
                <span className="text-slate-500">{opp.categoria}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
