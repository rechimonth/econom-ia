import React, { useState } from 'react';
import { 
  Heart, 
  Phone, 
  MapPin, 
  TrendingDown, 
  Store, 
  AlertCircle, 
  Check, 
  Share2, 
  ArrowRight,
  Eye
} from 'lucide-react';

export default function RetireeModeView() {
  const [selectedItems, setSelectedItems] = useState(['leche', 'pan', 'yerba', 'remedio']);

  const ESSENTIAL_ITEMS = [
    { id: 'leche', name: 'Leche La Serenísima 1L', precioNormal: 1450, precioBarato: 1200, lugar: 'Carrefour (Lunes y Martes)', ahorro: 250 },
    { id: 'pan', name: 'Pan Francés / Criollo 1kg', precioNormal: 2400, precioBarato: 1800, lugar: 'Panadería La Unión (Efectivo)', ahorro: 600 },
    { id: 'yerba', name: 'Yerba Mate 1kg (Playadito/Chamigo)', precioNormal: 5100, precioBarato: 4100, lugar: 'Supermercado Chen', ahorro: 1000 },
    { id: 'aceite', name: 'Aceite de Girasol 1.5L', precioNormal: 3200, precioBarato: 2600, lugar: 'Autoservicio Luna', ahorro: 600 },
    { id: 'remedio', name: 'Ibuprofeno 600mg (Caja x20)', precioNormal: 4800, precioBarato: 2900, lugar: 'Farmacia Sindical / Genérico', ahorro: 1900 },
    { id: 'fideos', name: 'Fideos Guiseros 500g', precioNormal: 1800, precioBarato: 1400, lugar: 'Supermercado Chen', ahorro: 400 }
  ];

  const totalAhorro = ESSENTIAL_ITEMS
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, curr) => acc + curr.ahorro, 0);

  const totalGasto = ESSENTIAL_ITEMS
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, curr) => acc + curr.precioBarato, 0);

  const toggleItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner Jubilados y Adultos Mayores */}
      <div className="rounded-3xl bg-amber-500 text-slate-950 p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 fill-slate-950 stroke-none" />
          <span className="text-sm font-extrabold uppercase tracking-wider bg-slate-950 text-amber-400 px-2.5 py-1 rounded-full">
            Modo Jubilado & Adultos Mayores
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight">
          Ahorrá en tu compra básica sin letra chica
        </h2>
        <p className="text-lg font-bold text-slate-900 leading-snug">
          Letras grandes y los precios más bajos verificados a mano en Lanús y Monte Chingolo.
        </p>
      </div>

      {/* Tarjeta de Ahorro Directo */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-2">
        <span className="text-sm font-bold text-slate-400 uppercase block">
          Ahorro total en tus productos elegidos:
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400">
            $ {totalAhorro.toLocaleString('es-AR')}
          </span>
          <span className="text-base text-slate-300">
            Total a pagar en los lugares sugeridos: <strong className="text-white font-mono">$ {totalGasto.toLocaleString('es-AR')}</strong>
          </span>
        </div>
      </div>

      {/* Lista de Productos Esenciales para Jubilados */}
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-white px-1">
          Tocá los productos que necesitás:
        </h3>

        <div className="space-y-3">
          {ESSENTIAL_ITEMS.map((item) => {
            const isChecked = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-4 select-none ${
                  isChecked
                    ? 'bg-slate-900 border-amber-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isChecked ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isChecked ? <Check className="w-5 h-5 stroke-[3]" /> : null}
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-white block">
                      {item.name}
                    </span>
                    <span className="text-sm sm:text-base text-amber-300 font-semibold block mt-0.5">
                      📍 Dónde: {item.lugar}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block">
                    $ {item.precioBarato.toLocaleString('es-AR')}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through block">
                    Antes: $ {item.precioNormal.toLocaleString('es-AR')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 block mt-0.5">
                    Ahorrás $ {item.ahorro.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerta de Descuento con Banco Provincia / PAMI / Cuenta DNI */}
      <div className="p-5 rounded-2xl bg-sky-950/70 border-2 border-sky-500/50 space-y-2">
        <div className="flex items-center gap-2 text-sky-300 font-bold text-lg">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>Atención Jubilados de Lanús:</span>
        </div>
        <p className="text-base text-slate-200 leading-relaxed">
          Recordá que los <strong>días lunes y martes</strong> tenés hasta <strong>20% de reintegro</strong> pagando con tarjeta de débito previsional de Banco Provincia o Cuenta DNI en farmacias y almacenes adheridos.
        </p>
      </div>
    </div>
  );
}
