import React from 'react';
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ImageComparison } from '../../../shared/components/ImageComparison';
import { formatCurrency, formatDateTime } from '../../../shared/utils/formatters';
import type { Appointment, AppointmentStatus } from '../../../domain/Appointment';
import { appointmentStatusLabel } from '../../../domain/appointmentStatus';

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface ClientDashboardViewProps {
  appointments: Appointment[];
  activeAppointment?: Appointment;
  isLoading: boolean;
  error: string | null;
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (id: string) => void;
  timelineSteps: TimelineStep[];
  refetch: () => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({
  appointments,
  activeAppointment,
  isLoading,
  selectedAppointmentId,
  setSelectedAppointmentId,
  timelineSteps,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Carregando seus agendamentos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status?: AppointmentStatus) => {
    const label = appointmentStatusLabel(status ?? 'PENDING');

    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {label}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {label}
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {label}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Painel do Cliente
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Acompanhe o status do seu serviço e visualize as fotos aéreas de drone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SIDEBAR LATERAL: LISTA DE AGENDAMENTOS (4 colunas) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Meus Agendamentos ({appointments.length})
                </h2>

                <div className="space-y-2">
                  {appointments.map((app) => {
                    const isSelected = app.id === selectedAppointmentId || app.id === activeAppointment?.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedAppointmentId(app.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-50/80 border-cyan-300 shadow-xs'
                            : 'bg-white border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              #{app.id.slice(-6).toUpperCase()}
                            </span>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-xs text-slate-500">{formatDateTime(app.dateTime)}</p>
                          <p className="text-xs font-medium text-slate-700 truncate max-w-[200px]">
                            {app.address.street}, {app.address.number}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-cyan-700 translate-x-0.5' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Dica de Eficiência */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Zap className="w-4 h-4 fill-white" />
                  Dica de Manutenção
                </div>
                <p className="text-xs text-amber-50 leading-relaxed">
                  A manutenção preventiva semestral com higienização técnica ajuda a evitar microfissuras e pode recuperar até 30% da eficiência energética do sistema.
                </p>
              </div>
            </div>

            {/* ÁREA PRINCIPAL: DETALHES DO SERVIÇO & GALERIA DRONE (8 colunas) */}
            <div className="lg:col-span-8 space-y-6">
              {activeAppointment ? (
                <>
                  {/* CARD DE STATUS & TIMELINE */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl font-bold text-slate-900">
                            Ordem de Serviço #{activeAppointment.id.slice(-6).toUpperCase()}
                          </h2>
                          {getStatusBadge(activeAppointment.status)}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Criado em {formatDateTime(activeAppointment.createdAt)}
                        </p>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                        <span className="text-xs font-semibold text-slate-400 block">Valor Total</span>
                        <span className="text-xl font-extrabold text-cyan-700">
                          {formatCurrency(activeAppointment.price)}
                        </span>
                      </div>
                    </div>

                    {/* TIMELINE VISUAL */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Progresso do Atendimento
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {timelineSteps.map((step, idx) => (
                          <div
                            key={step.id}
                            className={`p-4 rounded-xl border transition-all ${
                              step.isCurrent
                                ? 'bg-cyan-50/70 border-cyan-400 shadow-xs'
                                : step.isCompleted
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-slate-50 border-slate-100 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  step.isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : step.isCurrent
                                    ? 'bg-cyan-600 text-white animate-pulse'
                                    : 'bg-slate-300 text-slate-600'
                                }`}
                              >
                                {step.isCompleted ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-xs font-bold ${
                                  step.isCurrent
                                    ? 'text-cyan-900'
                                    : step.isCompleted
                                    ? 'text-emerald-900'
                                    : 'text-slate-600'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* GALERIA DE SERVIÇO: FOTOS DE DRONE ANTES X DEPOIS */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            Laudo Visual & Fotos do Drone (4K)
                          </h3>
                          <p className="text-xs text-slate-500">
                            Inspeção de conformidade e comparativo antes/depois da manutenção preventiva
                          </p>
                        </div>
                      </div>

                      {activeAppointment.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <FileCheck className="w-3.5 h-3.5" />
                          Laudo Aprovado
                        </span>
                      )}
                    </div>

                    {activeAppointment.droneBeforePhotoUrl && activeAppointment.droneAfterPhotoUrl ? (
                      <div className="space-y-4">
                        <ImageComparison
                          beforeImage={activeAppointment.droneBeforePhotoUrl}
                          afterImage={activeAppointment.droneAfterPhotoUrl}
                          beforeLabel="Antes (Vistoria Drone)"
                          afterLabel="Depois (Manutenção Concluída)"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span>💡 Deslize a alça central para comparar os detalhes da placa solar.</span>
                          <span className="font-semibold text-cyan-700">Resolução 4K HDR</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
                        <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-700">Fotos de Drone em Processamento</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          A equipe técnica fará os registros aéreos antes de iniciar e logo após a conclusão do serviço. As imagens aparecerão automaticamente aqui.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* DETALHES ADICIONAIS DO IMÓVEL */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Local da Instalação:</span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {activeAppointment.address.street}, {activeAppointment.address.number}
                      </span>
                      <span className="text-slate-500 block">
                        {activeAppointment.address.city}/{activeAppointment.address.state}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Placas Solares:</span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {activeAppointment.panelsCount} Painéis Fotovoltaicos
                      </span>
                      <span className="text-emerald-600 font-medium block">
                        Água Desmineralizada Utilizada
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Garantia & Suporte:</span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        Tw Energia Solar (30 dias)
                      </span>
                      <span className="text-slate-500 block">
                        WhatsApp: (11) 98765-4321
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
                  <p className="text-sm text-slate-500">Nenhum agendamento selecionado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
