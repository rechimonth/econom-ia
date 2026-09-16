import { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getSupabaseClient } from '../../services/supabase/client';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setStatus('loading');
    setMessage('');

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/#app`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setStatus('sent');
      setMessage('Revisá tu email. Te enviamos un enlace seguro para entrar a Econom-IA.');
    } catch (error) {
      console.error('[auth] Magic-link error:', error);
      setStatus('error');
      setMessage('No pudimos enviar el enlace. Revisá el email e intentá nuevamente.');
    }
  };

  const handleOpenApp = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onSuccess?.();
        return;
      }
    } catch (error) {
      console.error('[auth] Session check failed:', error);
    }
    setStatus('idle');
    setMessage('Primero completá el acceso desde el enlace que enviamos a tu email.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-violet-950/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            <Mail className="h-6 w-6" />
          </div>

          <h2 id="auth-title" className="text-2xl font-black text-white">Entrá a Econom-IA</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Usamos un enlace mágico para que puedas entrar sin recordar contraseñas.
          </p>

          {status === 'sent' ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="font-semibold text-emerald-200">Enlace enviado</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenApp}
                className="mt-5 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Ya confirmé mi email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-200">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="vos@ejemplo.com"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/10"
                  required
                />
              </label>

              {message && status === 'error' && (
                <p className="text-sm text-rose-300" role="alert">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
              >
                {status === 'loading' ? 'Enviando…' : 'Recibir enlace seguro'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Al continuar aceptás el uso de Econom-IA para gestionar tu cuenta y tu suscripción.
          </p>
        </div>
      </div>
    </div>
  );
}
