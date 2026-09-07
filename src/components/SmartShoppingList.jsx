import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Check, 
  Plus, 
  Trash2, 
  ArrowRight, 
  TrendingDown, 
  Store, 
  DollarSign, 
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CATALOG = [
  { id: 'yerba', name: 'Yerba Mate Playadito 1kg', coto: 4950, carrefour: 4800, chino: 4150, best: 'chino' },
  { id: 'aceite', name: 'Aceite Girasol Natura 1.5L', coto: 3100, carrefour: 2950, chino: 2650, best: 'chino' },
  { id: 'leche', name: 'Leche La Serenísima Clásica 1L', coto: 1350, carrefour: 1290, chino: 1420, best: 'carrefour' },
  { id: 'fideos', name: 'Fideos Matarazzo Guiseros 500g', coto: 1750, carrefour: 1690, chino: 1450, best: 'chino' },
  { id: 'azucar', name: 'Azúcar Ledesma Clásica 1kg', coto: 1250, carrefour: 1200, chino: 1100, best: 'chino' },
  { id: 'arroz', name: 'Arroz Lucchetti Largo Fino 1kg', coto: 2200, carrefour: 2100, chino: 1850, best: 'chino' },
  { id: 'jabon', name: 'Jabón Líquido Skip 3L', coto: 12900, carrefour: 11800, chino: 12500, best: 'carrefour' },
  { id: 'papel', name: 'Papel Higiénico Higienol x4', coto: 3400, carrefour: 3100, chino: 2800, best: 'chino' },
  { id: 'galletitas', name: 'Galletitas Traviata x3', coto: 1400, carrefour: 1350, chino: 1200, best: 'chino' },
  { id: 'huevos', name: 'Huevos Maple x30 (o x6)', coto: 2400, carrefour: 2300, chino: 1950, best: 'chino' }
];

export default function SmartShoppingList({ isRetireeMode = false }) {
  const [selectedItemIds, setSelectedItemIds] = useState(['yerba', 'aceite', 'leche', 'fideos', 'azucar']);
  const [copied, setCopied] = useState(false);

  const toggleItem = (id) => {
    if (selectedItemIds.includes(id)) {
      if (selectedItemIds.length === 1) return; // keep at least 1
      setSelectedItemIds(selectedItemIds.filter(item => item !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const totals = useMemo(() => {
    const activeItems = CATALOG.filter(item => selectedItemIds.includes(item.id));
    
    const coto = activeItems.reduce((acc, item) => acc + item.coto, 0);
    const carrefour = activeItems.reduce((acc, item) => acc + item.carrefour, 0);
    const chino = activeItems.reduce((acc, item) => acc + item.chino, 0);
    
    // Combined optimal (best price for each individual product)
    const combinado = activeItems.reduce((acc, item) => {
      const minPrice = Math.min(item.coto, item.carrefour, item.chino);
      return acc + minPrice;
    }, 0);

    const peorPrecio = Math.max(coto, carrefour, chino);
    const ahorroMaximo = peorPrecio - combinado;
    const porcentajeAhorro = Math.round((ahorroMaximo / peorPrecio) * 100);

    return {
      coto,
      carrefour,
      chino,
      combinado,
      ahorroMaximo,
      porcentajeAhorro,
      peorPrecio,
      activeItems
    };
  }, [selectedItemIds]);

  const handleShareWhatsApp = () => {
    const text = `🛒 *Mi Lista de Compras Inteligente en Lanús (ECONOM-IA)*:\n` +
      `• Total en Coto: $ ${totals.coto.toLocaleString('es-AR')}\n` +
      `• Total en Carrefour: $ ${totals.carrefour.toLocaleString('es-AR')}\n` +
      `• Total en Autoservicio Chino: $ ${totals.chino.toLocaleString('es-AR')}\n` +
      `⭐ *Total Combinado Óptimo: $ ${totals.combinado.toLocaleString('es-AR')}*\n` +
      `💰 *Ahorro posible: $ ${totals.ahorroMaximo.toLocaleString('es-AR')} (${totals.porcentajeAhorro}%)*\n` +
      `Revisá tu lista para no pagar de más: https://econom-ia.app`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`space-y-6 ${isRetireeMode ? 'text-lg' : ''}`}>
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span>Optimizador de Changuito Semanal</span>
            </div>
            <h2 className={`${isRetireeMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-white`}>
              Lista de Compras Inteligente
            </h2>
            <p className={`${isRetireeMode ? 'text-base' : 'text-xs sm:text-sm'} text-slate-300 mt-1`}>
              Elegí qué necesitás comprar esta semana. Te calculamos en el acto dónde te conviene comprar cada cosa o el changuito completo.
            </p>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold ${isRetireeMode ? 'text-base py-3' : 'text-xs'} transition shadow-lg shadow-emerald-500/20 shrink-0`}
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? '¡Compartido!' : 'Compartir por WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* Resultados de la canasta: Tarjetas de Totales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Coto */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total en COTO</span>
            <Store className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-2">
            <span className={`${isRetireeMode ? 'text-2xl' : 'text-xl sm:text-2xl'} font-black font-mono text-slate-100`}>
              $ {totals.coto.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-slate-400 block">Comprando todo en hipermercado</span>
          </div>
        </div>

        {/* Carrefour */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total en CARREFOUR</span>
            <Store className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-2">
            <span className={`${isRetireeMode ? 'text-2xl' : 'text-xl sm:text-2xl'} font-black font-mono text-slate-100`}>
              $ {totals.carrefour.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-slate-400 block">Comprando todo en cadena</span>
          </div>
        </div>

        {/* Autoservicio Chino */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Total en CHINO BARRIAL</span>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Cercanía</span>
          </div>
          <div className="my-2">
            <span className={`${isRetireeMode ? 'text-2xl' : 'text-xl sm:text-2xl'} font-black font-mono text-amber-300`}>
              $ {totals.chino.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-slate-400 block">Autoservicio de la manzana</span>
          </div>
        </div>

        {/* Total Combinado Óptimo */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/50 flex flex-col justify-between shadow-lg shadow-emerald-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">⭐ Total Combinado</span>
            <span className="text-[10px] font-extrabold bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">
              -{totals.porcentajeAhorro}%
            </span>
          </div>
          <div className="my-2">
            <span className={`${isRetireeMode ? 'text-2xl sm:text-3xl' : 'text-2xl'} font-black font-mono text-emerald-300`}>
              $ {totals.combinado.toLocaleString('es-AR')}
            </span>
            <span className="text-xs text-emerald-400 font-semibold block">
              Ahorrás $ {totals.ahorroMaximo.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      {/* Selector de productos */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`${isRetireeMode ? 'text-xl' : 'text-base'} font-bold text-white`}>
              Seleccioná los productos de tu compra ({selectedItemIds.length} elegidos)
            </h3>
            <p className={`${isRetireeMode ? 'text-sm' : 'text-xs'} text-slate-400 mt-0.5`}>
              Tocá para sumar o quitar productos básicos de tu lista.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CATALOG.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const minPrice = Math.min(item.coto, item.carrefour, item.chino);
            const bestStore = item.best === 'chino' ? 'Chino de cercanía' : item.best === 'carrefour' ? 'Carrefour' : 'Coto';

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 select-none ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className={`block font-semibold ${isRetireeMode ? 'text-base' : 'text-xs'} text-white`}>
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Más barato en: <strong className="text-emerald-400 font-semibold">{bestStore}</strong> ($ {minPrice.toLocaleString('es-AR')})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-slate-400 line-through block">
                    $ {Math.max(item.coto, item.carrefour, item.chino).toLocaleString('es-AR')}
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-400 block">
                    $ {minPrice.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
