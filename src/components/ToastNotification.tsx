import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 left-6 z-[9999] max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-900/95 text-emerald-100 border-emerald-700/80 shadow-emerald-950/50' 
          : isError 
            ? 'bg-rose-900/95 text-rose-100 border-rose-700/80 shadow-rose-950/50' 
            : 'bg-indigo-900/95 text-indigo-100 border-indigo-700/80 shadow-indigo-950/50'
      }`}>
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
          <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
        </div>
        <button
          onClick={hideToast}
          className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="إغلاق التنبيه"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
