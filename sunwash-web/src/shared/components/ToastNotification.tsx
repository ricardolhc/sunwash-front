import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-cyan-50 border-cyan-200 text-cyan-800',
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    info: 'text-cyan-600',
  }[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm transition-all duration-300 ${bgStyles}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors}`} />
      <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 -mr-1 -mt-1 p-1 rounded-md"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
