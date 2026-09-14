import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, X, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(({ title, message, type = 'success', duration = 3200 }) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const Icon = toast.type === 'error' ? XCircle : toast.type === 'info' ? Info : CheckCircle2;
          const iconClass = toast.type === 'error' ? 'text-rose-400' : toast.type === 'info' ? 'text-sky-400' : 'text-emerald-400';

          return (
            <div key={toast.id} className="pointer-events-auto rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur">
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{toast.title}</p>
                  {toast.message && <p className="mt-0.5 text-xs leading-5 text-slate-400">{toast.message}</p>}
                </div>
                <button type="button" onClick={() => removeToast(toast.id)} className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="Cerrar notificación">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
