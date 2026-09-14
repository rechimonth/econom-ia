import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Store, 
  Camera, 
  Plus, 
  CheckCircle, 
  MapPin, 
  ThumbsUp, 
  AlertCircle, 
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { COMMUNITY_PRICE_REPORTS } from '../data/mockData';

export default function CommunityWaze({ userProfile, onAskCopilot, setActiveTab }) {
  const [reports, setReports] = useState(COMMUNITY_PRICE_REPORTS);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMerchantApp, setShowMerchantApp] = useState(false);

  // New report form state
  const [newProducto, setNewProducto] = useState('');
  const [newComercio, setNewComercio] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [isChino, setIsChino] = useState(true);

  // Merchant quick price update state
  const [merchantPrices, setMerchantPrices] = useState({
    yerba: 4100,
    aceite: 2600,
    arroz: 1200,
    azucar: 980
  });

  const handleAddReport = (e) => {
    e.preventDefault();
    if (!newProducto || !newComercio || !newPrecio) return;

    const newEntry = {
      id: `rep_${Date.now()}`,
      producto: newProducto,
      comercio: newComercio,
      barrio: userProfile.barrio || "Monte Chingolo, Lanús",
      precio: Number(newPrecio),
      reportadoPor: 1,
      confiabilidad: 85,
      haceCuanto: "Recién",
      asociado: isChino,
      verificadoPorIA: true
    };

    setReports([newEntry, ...reports]);
    setShowReportModal(false);
    setNewProducto('');
    setNewComercio('');
    setNewPrecio('');
  };

  const handleUpvote = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          reportadoPor: r.reportadoPor + 1,
          confiabilidad: Math.min(99, r.confiabilidad + 1)
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Users className="w-4 h-4" />
              <span>Waze de Precios Colaborativo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Comunidad & "El Problema de los Chinos"
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Ninguna gran app tiene cobertura de los miles de autoservicios chinos de barrio.
              Nuestra comunidad reporta góndolas reales y los comerciantes asociados actualizan sus precios directos.
            </p>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Reportar Precio Góndola</span>
          </button>
        </div>
      </div>

      {/* Programa Comercio Asociado & Merchant App Preview */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Programa "Comercio Asociado"
              </span>
              <h3 className="text-sm font-bold text-white">
                Alianza con Autoservicios Chinos de Barrio
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowMerchantApp(!showMerchantApp)}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{showMerchantApp ? "Ocultar panel comerciante" : "Ver App Simple para Comerciantes"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          El comerciante chino recibe un perfil verificado gratuito y tráfico de clientes recomendados por ECONOM-IA. 
          A cambio, actualiza sus 4 productos gancho en 5 segundos.
        </p>

        {/* Merchant Quick Updater Panel Simulation (ETAPA 3) */}
        {showMerchantApp && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 mb-4 animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  Vista Comerciante: "Supermercado Luna (Calle Lynch)"
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Asociado Verificado
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Yerba 1kg</span>
                <input
                  type="number"
                  value={merchantPrices.yerba}
                  onChange={(e) => setMerchantPrices({ ...merchantPrices, yerba: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono font-bold mt-1 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Aceite 1.5L</span>
                <input
                  type="number"
                  value={merchantPrices.aceite}
                  onChange={(e) => setMerchantPrices({ ...merchantPrices, aceite: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono font-bold mt-1 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Arroz 1kg</span>
                <input
                  type="number"
                  value={merchantPrices.arroz}
                  onChange={(e) => setMerchantPrices({ ...merchantPrices, arroz: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono font-bold mt-1 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Azúcar 1kg</span>
                <input
                  type="number"
                  value={merchantPrices.azucar}
                  onChange={(e) => setMerchantPrices({ ...merchantPrices, azucar: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono font-bold mt-1 text-xs"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => alert("Precios actualizados en la red comunitaria en 0.2 segundos.")}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
              >
                Guardar Precios de Góndola Hoy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Community Reports Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Precios Reportados en Tiempo Real
          </h3>
          <span className="text-xs text-slate-400">
            Zona {userProfile.ciudad}
          </span>
        </div>

        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{rep.producto}</h4>
                {rep.asociado && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span>🏮</span> Chino Asociado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300 font-medium">{rep.comercio}</span>
                <span>•</span>
                <span>{rep.barrio}</span>
                <span>•</span>
                <span className="text-slate-500">{rep.haceCuanto}</span>
              </div>

              {/* Confidence Score Pill (MVP Spec: Reportado por 17 usuarios - Confiabilidad 96%) */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-[11px] text-slate-400">
                  Reportado por: <strong className="text-white font-mono">{rep.reportadoPor} usuarios</strong>
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  Confiabilidad: {rep.confiabilidad}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Precio verificado</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  $ {rep.precio.toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={() => handleUpvote(rep.id)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                title="Confirmar que el precio sigue vigente"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              Reportar Precio de Góndola
            </h3>

            <form onSubmit={handleAddReport} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Producto
                </label>
                <input
                  type="text"
                  required
                  value={newProducto}
                  onChange={(e) => setNewProducto(e.target.value)}
                  placeholder="Ej: Yerba Playadito 1kg"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nombre del Comercio y Dirección
                </label>
                <input
                  type="text"
                  required
                  value={newComercio}
                  onChange={(e) => setNewComercio(e.target.value)}
                  placeholder="Ej: Supermercado Luna (calle Lynch 2800)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Precio en Góndola ($ ARS)
                </label>
                <input
                  type="number"
                  required
                  value={newPrecio}
                  onChange={(e) => setNewPrecio(e.target.value)}
                  placeholder="Ej: 4150"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isChino"
                  checked={isChino}
                  onChange={(e) => setIsChino(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-800"
                />
                <label htmlFor="isChino" className="text-xs text-slate-300 cursor-pointer">
                  Es un autoservicio chino o comercio barrial
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Publicar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
