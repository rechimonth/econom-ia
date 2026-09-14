import React from 'react';
import {
  Sparkles,
  ShoppingCart,
  Receipt,
  UserCircle,
  Smartphone,
  Monitor,
  Zap,
  Building2,
  Heart
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
  isMobileFrame,
  setIsMobileFrame,
  isRetireeMode,
  setIsRetireeMode
}) {
  const navItems = [
    { id: 'lista', label: 'Lista Inteligente', icon: ShoppingCart },
    { id: 'movimientos', label: 'Movimientos', icon: Receipt },
    { id: 'radar_ieb', label: 'Radar & Índice Barrial', icon: Zap },
    { id: 'copiloto', label: 'Resumen Familiar', icon: Sparkles },
    { id: 'jubilado', label: 'Modo Jubilado', icon: Heart },
    { id: 'dossier', label: 'Plan Lean Solo Founder', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <div
          onClick={() => setActiveTab('lista')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">$</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">ECONOM-IA</span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">FAMILIAS</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Ahorrá dinero en cada compra semanal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRetireeMode(!isRetireeMode)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
              isRetireeMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Activar texto grande y navegación ultra simple para jubilados"
          >
            <Heart className={`w-3.5 h-3.5 ${isRetireeMode ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Modo Jubilado</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={isMobileFrame ? 'Cambiar a vista expandida de escritorio' : 'Simular pantalla de teléfono Android'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Vista Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Modo Teléfono</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 hover:border-emerald-500/40 text-slate-200 transition group"
          >
            <UserCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left hidden sm:block">
              <span className="block font-medium leading-none text-slate-100">{userProfile.name.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400">{userProfile.barrio || userProfile.ciudad}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
