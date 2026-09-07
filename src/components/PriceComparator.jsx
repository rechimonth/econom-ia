import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Sparkles, 
  TrendingDown, 
  Store, 
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data/mockData';

export default function PriceComparator({ onAskCopilot, setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([
    { id: 'yerba_playadito_1k', cantidad: 2 },
    { id: 'aceite_natura_15l', cantidad: 1 },
    { id: 'leche_serenisima_1l', cantidad: 4 },
    { id: 'fideos_matarazzo_500g', cantidad: 3 },
    { id: 'jabon_skip_3l', cantidad: 1 }
  ]);

  const categories = ['Todos', 'Alimentos', 'Limpieza', 'Bebidas', 'Perfumería'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter(prod => {
      const matchCat = selectedCategory === 'Todos' || prod.categoria === selectedCategory;
      const matchSearch = prod.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Add or update cart items
  const addToCart = (productId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { id: productId, cantidad: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.cantidad > 1) {
        return prev.map(item => item.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  // Cart totals comparison
  const cartAnalysis = useMemo(() => {
    let totalCoto = 0;
    let totalChino = 0;
    let totalMayorista = 0;
    let totalOptimizado = 0;

    cart.forEach(cartItem => {
      const prod = PRODUCTS_CATALOG.find(p => p.id === cartItem.id);
      if (!prod) return;

      totalCoto += prod.precios.coto * cartItem.cantidad;
      totalChino += prod.precios.chino * cartItem.cantidad;
      totalMayorista += prod.precios.mayorista * cartItem.cantidad;

      // Lowest available price across all channels
      const minPrice = Math.min(
        prod.precios.coto,
        prod.precios.carrefour,
        prod.precios.dia,
        prod.precios.chino,
        prod.precios.mayorista
      );
      totalOptimizado += minPrice * cartItem.cantidad;
    });

    const maxTotal = Math.max(totalCoto, totalChino, totalMayorista);
    const ahorroMax = maxTotal - totalOptimizado;
    const porcentajeAhorro = maxTotal > 0 ? Math.round((ahorroMax / maxTotal) * 100) : 0;

    return {
      totalCoto,
      totalChino,
      totalMayorista,
      totalOptimizado,
      ahorroMax,
      porcentajeAhorro,
      itemCount: cart.reduce((acc, item) => acc + item.cantidad, 0)
    };
  }, [cart]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            Comparador de Precios en Góndola
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparamos en tiempo real: Coto, Carrefour, Día, Chinos de barrio y Mayoristas.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar yerba, aceite, fideos..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View: Basket Optimizer Top Card */}
      {cart.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/30 p-4 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Estrategia de Compra Óptima
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {cartAnalysis.itemCount} productos en canasta
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Si dividís la compra ahorrás: <span className="text-emerald-400 font-mono">$ {cartAnalysis.ahorroMax.toLocaleString('es-AR')} ({cartAnalysis.porcentajeAhorro}%)</span>
              </h3>
            </div>

            {/* Price comparisons chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Todo en Coto</span>
                <span className="text-slate-200 font-bold">$ {cartAnalysis.totalCoto.toLocaleString('es-AR')}</span>
              </div>

              <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Todo en Chino</span>
                <span className="text-slate-200 font-bold">$ {cartAnalysis.totalChino.toLocaleString('es-AR')}</span>
              </div>

              <div className="bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-500/40">
                <span className="text-[10px] text-emerald-300 block font-sans font-bold">Dividida Inteligente</span>
                <span className="text-emerald-400 font-extrabold text-sm">$ {cartAnalysis.totalOptimizado.toLocaleString('es-AR')}</span>
              </div>

              <button
                onClick={() => {
                  onAskCopilot(`Tengo esta canasta de compras: ${cart.map(c => PRODUCTS_CATALOG.find(p => p.id === c.id)?.nombre).filter(Boolean).join(', ')}. ¿Cómo me conviene repartirla exactamente hoy en Lanús / Monte Chingolo para maximizar ahorro?`);
                  setActiveTab('chat');
                }}
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-sans text-xs transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <span>Reparto IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const cartItem = cart.find(c => c.id === prod.id);
          const inCartCount = cartItem?.cantidad || 0;

          // Find lowest price
          const pricesArray = [
            { retailer: "Mayorista", price: prod.precios.mayorista },
            { retailer: "Chino de barrio", price: prod.precios.chino },
            { retailer: "Día%", price: prod.precios.dia },
            { retailer: "Carrefour", price: prod.precios.carrefour },
            { retailer: "Coto", price: prod.precios.coto }
          ].sort((a, b) => a.price - b.price);

          const lowest = pricesArray[0];
          const highest = pricesArray[pricesArray.length - 1];
          const diffPesos = highest.price - lowest.price;

          return (
            <div
              key={prod.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {prod.categoria} • {prod.presentacion}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-0.5 leading-snug">
                      {prod.nombre}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 whitespace-nowrap">
                    +{prod.variacionMensual}% mes
                  </span>
                </div>

                {/* Best price callout */}
                <div className="mt-3 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-medium">Más barato en:</span>
                    <span className="font-bold text-emerald-300">{lowest.retailer}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-sm text-emerald-400">
                      $ {lowest.price.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      Ahorrás $ {diffPesos.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Retailer price list */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                    <span className="text-slate-400">Mayorista (Vital/Maxi):</span>
                    <span className="font-mono font-semibold">$ {prod.precios.mayorista.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                    <span className="text-slate-400">Autoservicio Chino:</span>
                    <span className="font-mono font-semibold text-emerald-400">$ {prod.precios.chino.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                    <span className="text-slate-400">Día%:</span>
                    <span className="font-mono">$ {prod.precios.dia.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                    <span className="text-slate-400">Carrefour:</span>
                    <span className="font-mono">$ {prod.precios.carrefour.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-400">
                    <span>Coto:</span>
                    <span className="font-mono font-semibold text-rose-300">$ {prod.precios.coto.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>

              {/* Basket action button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {inCartCount > 0 ? `${inCartCount} en tu canasta` : 'No está en canasta'}
                </span>

                {inCartCount === 0 ? (
                  <button
                    onClick={() => addToCart(prod.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(prod.id)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs text-white px-1">
                      {inCartCount}
                    </span>
                    <button
                      onClick={() => addToCart(prod.id)}
                      className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-slate-950 font-bold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
