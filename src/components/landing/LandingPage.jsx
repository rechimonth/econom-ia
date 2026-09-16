import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Check, ChartNoAxesCombined, ChevronDown, LockKeyhole, Sparkles, Target, WalletCards, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { getSupabaseClient } from '../../services/supabase/client';

const FEATURES = [
  { icon: WalletCards, title: 'Registrá', description: 'Ingresos, gastos, presupuestos y objetivos en un único espacio.' },
  { icon: ChartNoAxesCombined, title: 'Entendé', description: 'Visualizá cómo está evolucionando tu situación financiera.' },
  { icon: Bot, title: 'Preguntá', description: 'Consultá a Econom-IA y recibí respuestas basadas en tu contexto.' },
  { icon: Target, title: 'Decidí', description: 'Usá esa información para tomar decisiones más claras sobre tus próximos pasos.' },
];

function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-cyan-950/30">
      <div className="flex h-10 items-center gap-2 border-b border-slate-800 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <div className="ml-3 h-5 flex-1 rounded bg-slate-900" />
      </div>
      <div className="grid min-h-[430px] grid-cols-[150px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950 p-4">
          <div className="mb-8 flex items-center gap-2 text-sm font-black text-white"><span className="text-emerald-300">◢</span> Econom-IA</div>
          {['Inicio', 'Movimientos', 'Presupuestos', 'Metas', 'IA Copilot'].map((item, index) => (
            <div key={item} className={`mb-2 rounded-lg px-3 py-2 text-xs ${index === 0 ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>{item}</div>
          ))}
        </aside>
        <div className="relative overflow-hidden p-5">
          <div className="mb-5 flex items-center justify-between">
            <div><p className="text-[11px] text-slate-500">Resumen financiero</p><p className="text-lg font-bold text-white">Este mes</p></div>
            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[10px] font-bold text-violet-200">IA COPILOT</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Ingresos', '$ 2.450.000', '↑ 7,2%'],
              ['Gastos', '$ 1.280.000', '↓ 3,8%'],
              ['Saldo', '$ 1.170.000', '↑ 11,4%'],
            ].map(([label, value, delta]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3">
                <p className="text-[10px] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-black text-white">{value}</p>
                <p className="mt-1 text-[9px] text-emerald-300">{delta}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.45fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-4 flex justify-between text-[10px] text-slate-500"><span>Ingresos vs. gastos</span><span>Últimos 4 meses</span></div>
              <svg viewBox="0 0 560 180" className="h-44 w-full" role="img" aria-label="Gráfico de evolución financiera">
                <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity=".25"/><stop offset="100%" stopColor="#34d399" stopOpacity="0"/></linearGradient></defs>
                <path d="M0 150 C70 135 80 105 145 112 S230 84 280 98 S355 60 420 79 S490 50 560 37 V180 H0 Z" fill="url(#area)" />
                <path d="M0 150 C70 135 80 105 145 112 S230 84 280 98 S355 60 420 79 S490 50 560 37" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                <path d="M0 162 C80 155 105 135 155 144 S245 118 300 130 S385 102 430 119 S505 98 560 105" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-b from-violet-500/10 to-slate-900 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-200"><Sparkles className="h-4 w-4" /> IA Copilot</div>
              <div className="mt-4 space-y-3 text-[10px] leading-5">
                <div className="ml-auto max-w-[85%] rounded-xl bg-slate-800 px-3 py-2 text-slate-200">¿Por qué gasté más este mes?</div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-300">Tus gastos aumentaron un 18%. El mayor incremento está en comida y hogar.</div>
              </div>
              <div className="mt-5 flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[9px] text-slate-600">Escribí tu consulta…</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSupabaseClient().auth.getSession().catch(() => null).finally(() => {
      if (mounted) setSessionChecked(true);
    });
    return () => { mounted = false; };
  }, []);

  const openAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const openApp = () => {
    window.location.hash = 'app';
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    openApp();
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50 selection:bg-violet-500/40">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,.11),transparent_36%),radial-gradient(circle_at_85%_5%,rgba(139,92,246,.12),transparent_30%)]" />

      <nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-300/30 bg-emerald-300/10 text-emerald-300">◢</span>
            <span className="text-xl font-black tracking-tight">Econom<span className="text-violet-400">-IA</span></span>
          </button>
          <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <button type="button" onClick={() => scrollTo('features')} className="transition hover:text-white">Características</button>
            <button type="button" onClick={() => scrollTo('pricing')} className="transition hover:text-white">Precios</button>
            <button type="button" onClick={() => scrollTo('security')} className="transition hover:text-white">Seguridad</button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => openAuth('signin')} className="hidden text-sm font-semibold text-slate-300 transition hover:text-white sm:block">Iniciar sesión</button>
            <button type="button" onClick={() => openAuth('signup')} className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300">Empezar gratis</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200"><Sparkles className="h-3.5 w-3.5" /> Finanzas personales + IA</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-.045em] md:text-7xl">Tus finanzas.<br />Más claras.<br /><span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">Más inteligentes.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 md:text-xl">Gestioná tus ingresos, gastos y objetivos financieros desde un solo lugar y obtené ayuda de una IA que entiende tu situación. Menos planillas. Menos incertidumbre. Más control.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openAuth('signup')} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 font-black text-slate-950 shadow-xl shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:bg-emerald-300">Empezar gratis <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></button>
              <button type="button" onClick={() => scrollTo('how-it-works')} className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 font-bold text-white transition hover:border-slate-500 hover:bg-slate-900">Ver cómo funciona</button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Sin tarjeta de crédito para comenzar.</p>
          </div>
          <DashboardMockup />
        </section>

        <section id="how-it-works" className="border-y border-slate-800/70 bg-slate-950/70 py-20">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-300">Cómo funciona</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Tus finanzas no deberían sentirse como contabilidad.</h2><p className="mt-5 text-lg leading-8 text-slate-400">La mayoría de las herramientas financieras te muestran números. Econom-IA busca ayudarte a entender qué significan esos números y qué podés hacer con ellos.</p></div>
            <div id="features" className="mt-14 grid gap-4 md:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-slate-900"><div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-300"><Icon className="h-5 w-5" /></div><h3 className="text-xl font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-violet-300">Construido para confiar</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">La seguridad no está escondida en el backend.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">Econom-IA separa frontend, API, autenticación, datos, IA y billing. Los límites de uso se controlan del lado del servidor y las suscripciones se sincronizan mediante webhooks verificados.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[['Auth', 'Supabase Auth + Bearer tokens'], ['Datos', 'PostgreSQL + RLS'], ['IA', 'Cuotas server-side + timeout'], ['Billing', 'Stripe + webhooks verificados']].map(([label, text]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-violet-300" /><span className="font-black text-white">{label}</span></div><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></div>)}
          </div>
        </section>

        <section id="pricing" className="border-y border-slate-800/70 bg-slate-950/60 py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-violet-300">Pricing</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Pricing claro. Sin límites ocultos.</h2><p className="mt-5 text-lg text-slate-400">El límite protege la estabilidad y ayuda a mantener la IA disponible para todos.</p></div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <article className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-8"><p className="text-sm font-black text-emerald-300">FREE</p><div className="mt-3 text-5xl font-black">$0 <span className="text-base font-medium text-slate-500">/ mes</span></div><div className="my-8 space-y-4 text-sm text-slate-300">{['Gestión financiera y dashboard', 'Creación de presupuestos', 'Funciones principales', 'Hasta 3 consultas de IA por mes'].map((item) => <p key={item} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-emerald-300" />{item}</p>)}</div><button type="button" onClick={() => openAuth('signup')} className="mt-auto rounded-xl border border-slate-700 py-3.5 font-black text-white transition hover:bg-slate-800">Empezar gratis</button></article>
              <article className="relative flex flex-col rounded-3xl border border-violet-400/60 bg-gradient-to-b from-violet-500/10 to-slate-900 p-8 shadow-2xl shadow-violet-950/20"><span className="absolute right-5 top-5 rounded-full bg-violet-500 px-3 py-1 text-[10px] font-black text-white">RECOMENDADO</span><p className="text-sm font-black text-violet-300">PRO</p><div className="mt-3 text-5xl font-black">US$9.99 <span className="text-base font-medium text-slate-500">/ mes</span></div><div className="my-8 space-y-4 text-sm text-slate-300">{['Incluye todo lo de Free', 'Facturación recurrente vía Stripe', 'Acceso al Copilot con mayor cuota', 'Hasta 1.000 consultas de IA por mes'].map((item) => <p key={item} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-violet-300" />{item}</p>)}</div><button type="button" onClick={() => openAuth('signup')} className="mt-auto rounded-xl bg-violet-500 py-3.5 font-black text-white transition hover:bg-violet-400">Probar Econom-IA Pro</button></article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8"><div className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-emerald-400/10 via-slate-900 to-violet-500/10 p-10"><p className="text-2xl font-black md:text-4xl">Tu dinero, entendido por una IA.</p><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">Empezá gratis y descubrí una forma más clara de mirar tus finanzas.</p><button type="button" onClick={() => openAuth('signup')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300">Empezar gratis <ArrowRight className="h-4 w-4" /></button></div></section>
      </main>

      <footer className="border-t border-slate-800/70 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><span className="font-black text-slate-300">ECONOM-IA</span> <span className="mx-2">—</span> Tu dinero, entendido por una IA.</div><div className="text-xs">Web + escritorio · Argentina</div></div>
      </footer>

      {sessionChecked && authOpen && <AuthModal isOpen={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
      {authOpen && <button type="button" aria-label="Cerrar modal" onClick={() => setAuthOpen(false)} className="fixed inset-0 z-[90]" />}
    </div>
  );
}
