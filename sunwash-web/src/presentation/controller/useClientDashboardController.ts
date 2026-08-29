import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '../context/useDependencies';
import { STORAGE_KEYS } from '../../shared/constants/storage';
import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import { appointmentStatusLabel } from '../../domain/appointmentStatus';

export const useClientDashboardController = () => {
  const { listUserAppointmentsUseCase } = useDependencies();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const storedSession = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
  const userId = storedSession
    ? (JSON.parse(storedSession) as { id?: string }).id || 'user-client-01'
    : 'user-client-01';

  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['client-appointments', userId],
    queryFn: async () => {
      return listUserAppointmentsUseCase.execute(userId);
    },
  });

  // Salva o último agendamento ou o selecionado
  const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_APPOINTMENT_ID);
  const activeAppointment: Appointment | undefined =
    appointments.find((a) => a.id === (selectedAppointmentId || storedId)) || appointments[0];

  const getTimelineSteps = (status?: AppointmentStatus) => {
    const steps = [
      { id: 'PENDING', label: appointmentStatusLabel('PENDING'), description: 'Aguardando confirmação e agendamento' },
      { id: 'CONFIRMED', label: appointmentStatusLabel('CONFIRMED'), description: 'Técnico e horário alocados' },
      { id: 'IN_PROGRESS', label: appointmentStatusLabel('IN_PROGRESS'), description: 'Equipe no local / Vistoria drone' },
      { id: 'COMPLETED', label: appointmentStatusLabel('COMPLETED'), description: 'Manutenção preventiva e relatório finalizados' },
    ];

    const statusOrder: Record<AppointmentStatus, number> = {
      PENDING: 0,
      CONFIRMED: 1,
      IN_PROGRESS: 2,
      COMPLETED: 3,
      CANCELLED: -1,
    };

    const currentStepIndex = status ? statusOrder[status] ?? 0 : 0;

    return steps.map((step, idx) => ({
      ...step,
      isCompleted: currentStepIndex >= idx && currentStepIndex !== -1,
      isCurrent: currentStepIndex === idx,
    }));
  };

  return {
    appointments,
    activeAppointment,
    isLoading,
    error: error ? (error as Error).message : null,
    selectedAppointmentId: activeAppointment?.id || null,
    setSelectedAppointmentId,
    timelineSteps: getTimelineSteps(activeAppointment?.status),
    refetch,
  };
};
