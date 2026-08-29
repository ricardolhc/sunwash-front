import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  CalendarRange,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ToastNotification } from '../../../shared/components/ToastNotification';
import { formatCurrency, formatDateTime } from '../../../shared/utils/formatters';
import type { Appointment, AppointmentStatus } from '../../../domain/Appointment';
import { appointmentStatusLabel, appointmentStatuses } from '../../../domain/appointmentStatus';

interface ReportsViewProps {
  appointments: Appointment[];
  isLoading: boolean;
  isRefreshing: boolean;
  clientFilter: string;
  setClientFilter: (value: string) => void;
  startDateFilter: string;
  setStartDateFilter: (value: string) => void;
  endDateFilter: string;
  setEndDateFilter: (value: string) => void;
  statusFilter: 'ALL' | AppointmentStatus;
  setStatusFilter: (value: 'ALL' | AppointmentStatus) => void;
  clearFilters: () => void;
  totalItems: number;
  totalRevenue: number;
  completedCount: number;
  inProgressCount: number;
  isExporting: boolean;
  exportReport: () => Promise<void>;
  errorMessage: string | null;
  clearError: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  appointments,
  isLoading,
  isRefreshing,
  clientFilter,
  setClientFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  statusFilter,
  setStatusFilter,
  clearFilters,
  totalItems,
  totalRevenue,
  completedCount,
  inProgressCount,
  isExporting,
  exportReport,
  errorMessage,
  clearError,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <section className="rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-800 px-6 py-8 text-white shadow-xl shadow-cyan-950/10 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-100">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Relatórios gerenciais
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Painel de Relatórios</h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-cyan-50/85">
                    Consolide filtros operacionais, acompanhe volume financeiro e exporte em PDF a visualização atual com os filtros ativos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  void exportReport();
                }}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-200 disabled:shadow-none"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting ? 'Exportando PDF...' : 'Exportar para PDF'}
              </button>
            </div>
          </section>

          {errorMessage && (
            <ToastNotification type="error" message={errorMessage} onClose={clearError} />
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ordens filtradas</span>
              <div data-testid="reports-filtered-count" className="mt-2 text-3xl font-black text-slate-900">
                {totalItems}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Volume filtrado</span>
              <div
                data-testid="reports-filtered-revenue"
                className="mt-2 text-3xl font-black text-cyan-700"
              >
                {formatCurrency(totalRevenue)}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Concluídos
              </span>
              <div className="mt-2 text-3xl font-black text-emerald-600">{completedCount}</div>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Clock3 className="h-4 w-4 text-amber-500" />
                Em andamento
              </span>
              <div className="mt-2 text-3xl font-black text-amber-600">{inProgressCount}</div>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="space-y-5 border-b border-slate-100 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Filtros do relatório
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Limpar filtros
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Cliente
                  </span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      aria-label="Cliente"
                      type="text"
                      value={clientFilter}
                      onChange={(event) => setClientFilter(event.target.value)}
                      placeholder="Nome, e-mail ou telefone"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Data inicial
                  </span>
                  <div className="relative">
                    <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      aria-label="Data inicial"
                      type="date"
                      value={startDateFilter}
                      onChange={(event) => setStartDateFilter(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Data final
                  </span>
                  <div className="relative">
                    <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      aria-label="Data final"
                      type="date"
                      value={endDateFilter}
                      onChange={(event) => setEndDateFilter(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['ALL', ...appointmentStatuses] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                          statusFilter === status
                            ? 'bg-cyan-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'ALL' ? 'Todos' : appointmentStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {isRefreshing ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 font-semibold text-cyan-700">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Atualizando resultados
                    </span>
                  ) : (
                    <span>{totalItems} relatório(s) encontrado(s)</span>
                  )}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-600" />
                <p className="mt-2 text-xs text-slate-500">Carregando dados do relatório...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Nenhum relatório disponível para os filtros selecionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Cliente</th>
                      <th className="px-5 py-3.5">Data / Hora</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Painéis</th>
                      <th className="px-5 py-3.5">Local</th>
                      <th className="px-5 py-3.5 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{appointment.clientName}</div>
                          <div className="text-xs text-slate-500">{appointment.clientEmail}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-700">
                          {formatDateTime(appointment.dateTime)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                            {appointmentStatusLabel(appointment.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                          {appointment.panelsCount}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600">
                          {appointment.address.street}, {appointment.address.number}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-cyan-700">
                          {formatCurrency(appointment.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
