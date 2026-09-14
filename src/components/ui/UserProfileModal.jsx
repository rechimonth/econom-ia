import React, { useState } from 'react';
import { 
  X, 
  UserCircle, 
  DollarSign, 
  Home, 
  Car, 
  Users, 
  MapPin, 
  CreditCard, 
  Sparkles,
  Save,
  Check
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, userProfile, onSaveProfile }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({ ...userProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const totalIngresos = Number(form.sueldoNeto || 0) + Number(form.ingresosExtra || 0);
  const totalFijos = Number(form.alquiler || 0) + 
                     Number(form.expensasServicios || 0) + 
                     Number(form.vehiculoGasto || 0) + 
                     Number(form.educacionSalud || 0) + 
                     Number(form.tarjetaCreditoPromedio || 0);

  const fijosRatio = totalIngresos > 0 ? Math.round((totalFijos / totalIngresos) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Perfil Económico & Hogar
              </h3>
              <p className="text-xs text-slate-400">
                Ajustá tus números reales para calibrar el copiloto y la inflación de bolsillo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Summary Strip */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Ingresos Totales</span>
            <span className="font-mono font-bold text-white text-sm">
              $ {totalIngresos.toLocaleString('es-AR')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Gastos Fijos</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              $ {totalFijos.toLocaleString('es-AR')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">% en Fijos</span>
            <span className={`font-mono font-extrabold text-sm ${
              fijosRatio <= 50 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {fijosRatio}%
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Datos Personales y Hogar */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Módulo 1: Datos del Hogar y Ubicación
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Provincia</label>
                <input
                  type="text"
                  value={form.provincia}
                  onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ciudad / Partido</label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Barrio (Para relevamiento local)</label>
                <input
                  type="text"
                  value={form.barrio}
                  onChange={(e) => setForm({ ...form, barrio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Integrantes</label>
                  <input
                    type="number"
                    min="1"
                    value={form.integrantesHogar}
                    onChange={(e) => setForm({ ...form, integrantesHogar: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Hijos</label>
                  <input
                    type="number"
                    min="0"
                    value={form.hijos}
                    onChange={(e) => setForm({ ...form, hijos: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Ingresos y Gastos Fijos (Módulo 2) */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Módulo 2: Ingresos & Gastos Fijos Mensuales ($ ARS)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Sueldo Neto Principal</label>
                <input
                  type="number"
                  value={form.sueldoNeto}
                  onChange={(e) => setForm({ ...form, sueldoNeto: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ingresos Extra / Changas</label>
                <input
                  type="number"
                  value={form.ingresosExtra}
                  onChange={(e) => setForm({ ...form, ingresosExtra: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Alquiler / Hipoteca</label>
                <input
                  type="number"
                  value={form.alquiler}
                  onChange={(e) => setForm({ ...form, alquiler: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Expensas y Servicios (Luz/Gas/Internet)</label>
                <input
                  type="number"
                  value={form.expensasServicios}
                  onChange={(e) => setForm({ ...form, expensasServicios: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Vehículo (Nafta + Seguro)</label>
                <input
                  type="number"
                  value={form.vehiculoGasto}
                  onChange={(e) => setForm({ ...form, vehiculoGasto: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tarjeta de Crédito Promedio</label>
                <input
                  type="number"
                  value={form.tarjetaCreditoPromedio}
                  onChange={(e) => setForm({ ...form, tarjetaCreditoPromedio: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Guardado!' : 'Guardar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
