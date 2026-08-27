import { Loader2 } from 'lucide-react';

export const RouteSpinner = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700"
  >
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
      <span className="text-sm font-medium">Carregando...</span>
    </div>
  </div>
);
