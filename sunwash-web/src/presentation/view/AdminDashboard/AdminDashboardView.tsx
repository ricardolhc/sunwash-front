import React from 'react';
import {
  Shield,
  Filter,
  CheckCircle2,
  Camera,
  Eye,
  UploadCloud,
  X,
  Loader2,
  Check,
} from 'lucide-react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ToastNotification } from '../../../shared/components/ToastNotification';
import { formatCurrency, formatDateTime } from '../../../shared/utils/formatters';
import type { Appointment, AppointmentStatus } from '../../../domain/Appointment';

interface AdminDashboardViewProps {
  appointments: Appointment[];
  allAppointmentsCount: number;
  isLoading: boolean;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  selectedRoofPhoto: string | null;
  setSelectedRoofPhoto: (url: string | null) => void;
  droneUploadModalAppointment: Appointment | null;
  setDroneUploadModalAppointment: (app: Appointment | null) => void;
  droneBeforeUrl: string;
  setDroneBeforeUrl: (url: string) => void;
  droneAfterUrl: string;
  setDroneAfterUrl: (url: string) => void;
  handleOpenDroneUpload: (app: Appointment) => void;
  handleSaveDronePhotos: (e: React.FormEvent) => void;
  isUploadingDrone: boolean;
  handleUpdateStatus: (id: string, status: AppointmentStatus) => void;
  isUpdatingStatus: boolean;
  handleFinalizeService: (id: string) => void;
  isFinalizing: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  clearFeedback: () => void;
  refetch: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  appointments,
  allAppointmentsCount,
  isLoading,
  statusFilter,
  setStatusFilter,
  selectedRoofPhoto,
  setSelectedRoofPhoto,
  droneUploadModalAppointment,
  setDroneUploadModalAppointment,
  droneBeforeUrl,
  setDroneBeforeUrl,
  droneAfterUrl,
  setDroneAfterUrl,
  handleOpenDroneUpload,
  handleSaveDronePhotos,
  isUploadingDrone,
  handleUpdateStatus,
  isUpdatingStatus,
  handleFinalizeService,
  isFinalizing,
  successMessage,
  errorMessage,
  clearFeedback,
}) => {
  const totalRevenue = appointments.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const inProgressCount = appointments.filter((a) => a.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Shield className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Painel de Operações Técnicas (Admin)
                </h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Gestão de ordens de serviço, upload de laudos de drone e liquidação de cauções.
              </p>
            </div>
          </div>

          {/* Feedback Toasts */}
          {successMessage && (
            <ToastNotification type="success" message={successMessage} onClose={clearFeedback} />
          )}
          {errorMessage && (
            <ToastNotification type="error" message={errorMessage} onClose={clearFeedback} />
          )}

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-400">Total Agendamentos</span>
              <div className="text-2xl font-extrabold text-slate-900">{allAppointmentsCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-400">Em Execução Hoje</span>
              <div className="text-2xl font-extrabold text-amber-600">{inProgressCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-400">Serviços Concluídos</span>
              <div className="text-2xl font-extrabold text-emerald-600">{completedCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-400">Volume Transacionado</span>
              <div className="text-2xl font-extrabold text-cyan-700">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>

          {/* FILTROS E TABELA DE CLIENTES */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header da Tabela com Filtros */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Filtrar por Status:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        statusFilter === st
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'Todos' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TABELA RESPONSIVA */}
            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-2">Carregando lista de agendamentos...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Nenhum agendamento encontrado para o filtro selecionado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5">Cliente / Contato</th>
                      <th className="px-5 py-3.5">Endereço</th>
                      <th className="px-5 py-3.5">Data / Hora</th>
                      <th className="px-5 py-3.5">Placas / Valor</th>
                      <th className="px-5 py-3.5">Status Atual</th>
                      <th className="px-5 py-3.5 text-right">Ações Operacionais</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{app.clientName}</div>
                          <div className="text-xs text-slate-500">{app.clientPhone}</div>
                          <div className="text-[11px] text-slate-400">{app.clientEmail}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-xs font-medium text-slate-800">
                            {app.address.street}, {app.address.number}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.address.neighborhood ? `${app.address.neighborhood}, ` : ''}
                            {app.address.city}/{app.address.state}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-slate-700">
                          {formatDateTime(app.dateTime)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-cyan-700">{formatCurrency(app.price)}</div>
                          <div className="text-[11px] text-slate-400">{app.panelsCount} Placas</div>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={app.status}
                            disabled={isUpdatingStatus}
                            onChange={(e) =>
                              handleUpdateStatus(app.id, e.target.value as AppointmentStatus)
                            }
                            className="text-xs font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                          >
                            <option value="PENDING">PENDENTE</option>
                            <option value="CONFIRMED">CONFIRMADO</option>
                            <option value="IN_PROGRESS">EM ANDAMENTO</option>
                            <option value="COMPLETED">CONCLUÍDO</option>
                            <option value="CANCELLED">CANCELADO</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ver Foto do Telhado enviada pelo cliente */}
                            {app.roofPhotoUrl && (
                              <button
                                type="button"
                                onClick={() => setSelectedRoofPhoto(app.roofPhotoUrl || null)}
                                className="p-2 rounded-lg text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 border border-slate-200 transition-colors"
                                title="Ver Foto do Telhado Enviada pelo Cliente"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            {/* Modal de Upload de Fotos do Drone */}
                            <button
                              type="button"
                              onClick={() => handleOpenDroneUpload(app)}
                              className="p-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors"
                              title="Subir Fotos do Drone (Antes/Depois)"
                            >
                              <Camera className="w-4 h-4" />
                            </button>

                            {/* Finalizar Serviço & Capturar Caução */}
                            {app.status !== 'COMPLETED' ? (
                              <button
                                type="button"
                                disabled={isFinalizing}
                                onClick={() => handleFinalizeService(app.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-50"
                                title="Finalizar Serviço e Capturar Caução"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Finalizar & Capturar
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                                <CheckCircle2 className="w-3 h-3" />
                                Liquidado
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: VISUALIZAR FOTO DO TELHADO DO CLIENTE */}
      {selectedRoofPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Foto do Telhado Enviada pelo Cliente
              </h3>
              <button
                onClick={() => setSelectedRoofPhoto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-100">
              <img
                src={selectedRoofPhoto}
                alt="Foto do Telhado"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedRoofPhoto(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD DAS FOTOS DE DRONE (ANTES & DEPOIS) */}
      {droneUploadModalAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload de Fotos do Drone (Antes & Depois)
                </h3>
                <p className="text-xs text-slate-500">
                  Ordem de Serviço #{droneUploadModalAppointment.id.slice(-6).toUpperCase()} • {droneUploadModalAppointment.clientName}
                </p>
              </div>
              <button
                onClick={() => setDroneUploadModalAppointment(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDronePhotos} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL da Foto do Drone (ANTES DA LIMPEZA) *
                </label>
                <input
                  type="url"
                  required
                  value={droneBeforeUrl}
                  onChange={(e) => setDroneBeforeUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL da Foto do Drone (DEPOIS DA LIMPEZA) *
                </label>
                <input
                  type="url"
                  required
                  value={droneAfterUrl}
                  onChange={(e) => setDroneAfterUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100 text-xs text-cyan-900">
                💡 Essas imagens serão disponibilizadas instantaneamente no painel do cliente no slider de comparação interativo.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDroneUploadModalAppointment(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingDrone}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploadingDrone ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando Fotos...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Salvar Fotos de Drone
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
